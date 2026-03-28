# Chat API Troubleshooting Guide: AI SDK 4.x Migration & Gemini Integration

## Overview
This document chronicles the complete troubleshooting process for migrating from AI SDK 3.x to 4.x and integrating Google Gemini API for chat functionality in a Next.js application. This serves as both a postmortem and a reference guide for similar issues.

## Initial Problem
After 5 months of project inactivity, the chat functionality was completely broken with multiple cascading errors when attempting to send messages.

## Error Timeline & Solutions

### 1. Environment Variable Issues
**Error:** `TypeError: fetch failed` in middleware
**Root Cause:** Missing/expired Upstash Redis credentials
**Solution:** Updated `.env` file with new Upstash Redis credentials
```bash
UPSTASH_REDIS_REST_URL=your_url_here
UPSTASH_REDIS_REST_TOKEN=your_new_token_here
```

### 2. AI SDK Import Errors
**Error:** `Module not found: Package path ./react is not exported from package .../ai`
**Root Cause:** AI SDK 4.x removed the `/react` export path
**Diagnosis:** The `useChat` hook import path changed from `"ai/react"` to `"@ai-sdk/react"`
**Solution:** Updated imports in `components/chat/ChatComponent.tsx`
```javascript
// OLD (AI SDK 3.x)
import { useChat } from "ai/react";

// NEW (AI SDK 4.x)
import { useChat, type UIMessage } from "@ai-sdk/react";
```

### 3. Message Structure Breaking Changes
**Error:** `"Module not found: Package path ./react is not exported"`
**Root Cause:** `UIMessage` structure changed from having `content` property to `parts` array
**Solution:** Updated message rendering in `components/chat/Message.tsx`
```javascript
// OLD
<Markdown text={message.content} />

// NEW
<Markdown text={
  message.parts?.find(part => part.type === "text")?.text || ""
} />
```

### 4. Embeddings Context Extraction Error
**Error:** `TypeError: Cannot read properties of undefined (reading 'replace')`
**Root Cause:** Chat API trying to extract `lastMessage.content` which doesn't exist in new `UIMessage` structure
**Solution:** Updated `app/api/chat/route.ts` to extract text from `parts` array
```javascript
// OLD
const context1 = await getContext(lastMessage.content, fileKey);

// NEW
const messageText = lastMessage.parts?.find((part: any) => part.type === "text")?.text || lastMessage.content || "";
const context1 = await getContext(messageText, fileKey);
```

### 5. Message Conversion API Errors
**Error:** `Invalid prompt: The messages must be a ModelMessage[]. If you have passed a UIMessage[], you can use convertToModelMessages`
**Root Cause:** AI SDK 4.x requires explicit conversion from `UIMessage[]` to `ModelMessage[]`
**Initial Solution:** Used `convertToModelMessages` function
```javascript
import { convertToModelMessages } from "ai";
const modelMessages = convertToModelMessages(allMessages);
```

### 6. Filter Method Errors
**Error:** `TypeError: Cannot read properties of undefined (reading 'filter')`
**Root Cause:** `convertToModelMessages` receiving undefined or malformed message arrays
**Solution:** Added validation and fallback conversion
```javascript
// Validate messages array
if (!messages || !Array.isArray(messages)) {
  return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
}

// Fallback conversion if convertToModelMessages fails
try {
  modelMessages = convertToModelMessages(allMessages);
} catch (error) {
  modelMessages = allMessages.map((msg: any) => ({
    role: msg.role,
    content: msg.parts?.find((part: any) => part.type === "text")?.text || msg.content || ""
  }));
}
```

### 7. API Key Environment Variable Mismatch
**Error:** `LoadAPIKeyError: Google Generative AI API key is missing`
**Root Cause:** Inconsistent environment variable names between old and new code
**Solution:** Standardized to `GOOGLE_GENERATIVE_AI_API_KEY`
```bash
# .env file
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
```
Updated `utils/embeddings.ts`:
```javascript
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY as string);
```

### 8. Gemini Model Availability Issues
**Error:** `models/gemini-1.5-flash is not found for API version v1beta`
**Root Cause:** Multiple issues with model names and API versions
**Research:** Found Stack Overflow and GitHub discussions revealing:
- Gemini 1.5+ models require `v1beta` API version
- Model names must match exactly with official documentation

**Evolution of Solutions:**
1. **Wrong model name:** `"gemini-1.5-flash"` → not found
2. **Added version suffix:** `"gemini-1.5-flash-latest"` → still not found  
3. **Tried specific version:** `"gemini-1.5-flash-001"` → still not found
4. **Added API version:** `{ apiVersion: 'v1beta' }` → progress but still not found
5. **Switched to Pro model:** `"gemini-1.5-pro"` → still not found
6. **Final solution:** `"gemini-2.0-flash-lite"` with `v1beta` → SUCCESS ✅

### 9. AI SDK Compatibility Issues
**Root Cause:** `@ai-sdk/google` package had persistent API compatibility issues
**Final Solution:** Replaced with direct `@google/generative-ai` SDK
```javascript
// Removed problematic AI SDK imports
// import { google } from "@ai-sdk/google";
// import { streamText, convertToModelMessages } from "ai";

// Added direct Google AI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";
```

### 10. Manual Chat Implementation
**Root Cause:** `useChat` hook from AI SDK 4.x had too many breaking changes
**Solution:** Implemented manual chat functionality
```javascript
// Manual state management
const [messages, setMessages] = useState<UIMessage[]>([]);
const [isGenerating, setIsGenerating] = useState(false);

// Manual API calls with streaming
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: newMessages, chatId }),
});

// Manual streaming response handling
const reader = response.body?.getReader();
const decoder = new TextDecoder();
// ... streaming logic
```

## Final Working Configuration

### Environment Variables
```bash
# .env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_from_google_ai_studio
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
# ... other variables
```

### Chat API Route (`app/api/chat/route.ts`)
```javascript
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { eq } from "drizzle-orm";
import { db } from "@/utils/db";
import { chats } from "@/utils/schema";
import { getContext } from "@/app/context";

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    
    // Validate messages array
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    // Get chat and file key for context
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length !== 1) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }
    const fileKey = _chats[0].fileKey;

    // Extract context from last message
    const lastMessage = messages[messages.length - 1];
    const messageText = lastMessage?.parts?.find((part: any) => part.type === "text")?.text || lastMessage?.content || "";
    const context1 = await getContext(messageText, fileKey);

    // Build system instruction
    const systemContent = `
AI assistant is a brand new, powerful, human-like artificial intelligence.
Traits: expert knowledge, helpfulness, cleverness, articulateness; friendly, kind, inspiring.
Big fan of Pinecone and Vercel.
START CONTEXT BLOCK
${context1}
END OF CONTEXT BLOCK
The assistant will consider any CONTEXT BLOCK provided. It will not apologize for previous responses but will indicate when new information was gained.
    `.trim();

    // Initialize Google AI with correct model and API version
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" }, { apiVersion: 'v1beta' });

    // Convert messages and build conversation history
    const validMessages = messages.filter((msg: any) => msg && msg.role);
    
    // Add system instruction as conversation starter
    const systemHistory = [
      { role: "user", parts: [{ text: systemContent }] },
      { role: "model", parts: [{ text: "I understand. I am an AI assistant with expert knowledge, helpfulness, cleverness, and articulateness. I'm friendly, kind, and inspiring. I'll consider any context provided and indicate when new information is gained without apologizing for previous responses." }] }
    ];

    const messageHistory = validMessages
      .filter((msg: any) => msg.role !== "system")
      .map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.parts?.find((part: any) => part.type === "text")?.text || msg.content || "" }]
      }));

    const fullHistory = [...systemHistory, ...messageHistory.slice(0, -1)];

    // Start chat and get streaming response
    const chat = model.startChat({ history: fullHistory });
    const lastUserMessage = validMessages[validMessages.length - 1];
    const userInput = lastUserMessage.parts?.find((part: any) => part.type === "text")?.text || lastUserMessage.content || "";
    const result = await chat.sendMessageStream(userInput);

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
```

### Client Component (`components/chat/ChatComponent.tsx`)
```javascript
// Manual implementation replacing useChat hook
const [messages, setMessages] = useState<UIMessage[]>([]);
const [isGenerating, setIsGenerating] = useState(false);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!input.trim() || isGenerating) return;
  
  const userMessage: UIMessage = {
    id: Date.now().toString(),
    role: "user",
    parts: [{ type: "text", text: input }],
  };
  
  const newMessages = [...messages, userMessage];
  setMessages(newMessages);
  setInput("");
  setIsGenerating(true);
  
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages, chatId }),
    });
    
    // Handle streaming response...
  } catch (error) {
    console.error("Error sending message:", error);
  } finally {
    setIsGenerating(false);
  }
};
```

## Key Lessons Learned

### 1. **Breaking Changes in Major Versions**
- AI SDK 4.x introduced significant breaking changes
- Import paths, hook APIs, and message structures all changed
- Always check migration guides for major version updates

### 2. **Model Name Precision**
- Model names must match exactly with official documentation
- Different API versions support different models
- Use official model pages (like Gemini Models page) as source of truth

### 3. **API Version Importance**
- Beta features require explicit API version specification
- `v1beta` vs `v1` can determine model availability
- Always specify API version for consistency

### 4. **Environment Variable Consistency**
- Different packages may expect different environment variable names
- Standardize on one naming convention across the application
- Document expected environment variables clearly

### 5. **Fallback Strategies**
- When third-party hooks break, manual implementation may be more reliable
- Direct SDK usage often provides more control than wrapper libraries
- Keep fallback options for critical functionality

### 6. **Debugging Approach**
- Start with the most specific error message
- Work backwards through the call stack
- Use official documentation and community discussions (Stack Overflow, GitHub)
- Test each change incrementally

## Verification Steps

To verify the chat is working correctly:

1. **Environment Setup:**
   ```bash
   # Check .env file has correct variables
   cat .env | grep GOOGLE_GENERATIVE_AI_API_KEY
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Test Chat Functionality:**
   - Navigate to `/chat/[chatId]`
   - Send a test message like "hello"
   - Verify streaming response appears
   - Check browser console for errors
   - Check server logs for API calls

4. **Expected Behavior:**
   - Message appears immediately in chat
   - AI response streams in real-time
   - No console errors
   - Proper message formatting with Markdown support

## Future Considerations

1. **Model Updates:** Gemini model names may change; monitor official documentation
2. **API Version Migration:** Eventually migrate from `v1beta` to stable `v1` when available
3. **Error Handling:** Add more robust error handling and user feedback
4. **Performance:** Consider implementing message caching and optimistic updates
5. **Monitoring:** Add logging and monitoring for chat API usage and errors

## Resources Used

- [AI SDK 4.x Documentation](https://sdk.vercel.ai/)
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini Models Official Page](https://ai.google.dev/gemini-api/docs/models/gemini)
- [Stack Overflow: Model not found when using gemini 1.5](https://stackoverflow.com/questions/...)
- [GitHub Discussion: Dify Gemini Integration](https://github.com/langgenius/dify/discussions/17263)

---

**Created:** January 2025  
**Last Updated:** January 2025  
**Status:** ✅ Resolved - Chat functionality fully operational

