# 🚀 Ollama Migration Plan: Google Gemini → Open Source (Llama 3.1)

**Date**: February 1, 2026  
**Branch**: `feature/new-theme`  
**Status**: IN PROGRESS  

---

## 📋 Executive Summary

Migrating the InterviewPrep application from Google Gemini AI to fully open-source models running on Ollama.

| Component | Current (Gemini) | Target (Ollama) |
|-----------|------------------|-----------------|
| **Text Generation** | `gemini-2.0-flash-lite` | `llama3.1:70b` |
| **Embeddings** | `text-embedding-004` (768-dim) | `nomic-embed-text` (768-dim) |
| **Provider** | Google Cloud API | Ollama (local) |
| **Cost** | Pay-per-token | FREE |

---

## 🔍 Current Architecture Analysis

### Files Using Google Gemini AI

| # | File | AI Function | API Key Used |
|---|------|-------------|--------------|
| 1 | `lib/server/gemini.ts` | Server-only Gemini client | `GEMINI_API_KEY` |
| 2 | `utils/GeminiAIModal.ts` | Client wrapper (backwards compat) | `NEXT_PUBLIC_GEMINI_API_KEY` |
| 3 | `utils/embeddings.ts` | Embedding generation | `GOOGLE_GENERATIVE_AI_API_KEY` |
| 4 | `app/api/chat/route.ts` | Streaming RAG chat | `GOOGLE_GENERATIVE_AI_API_KEY` |
| 5 | `app/api/generate-interview/route.ts` | Interview question generation | Uses #2 |
| 6 | `app/api/generate-technical-question/route.ts` | Technical question generation | Uses #2 |
| 7 | `components/interview/behavioral/RecordAnswer.tsx` | Behavioral feedback | Uses #2 |
| 8 | `components/interview/technical/TechnicalAnswer.tsx` | Code evaluation | Uses #2 |
| 9 | `components/interview/technical/TechnicalInterview.tsx` | Technical interview | Uses #2 |

### Current Environment Variables
```bash
GEMINI_API_KEY=xxx                    # lib/server/gemini.ts
NEXT_PUBLIC_GEMINI_API_KEY=xxx        # utils/GeminiAIModal.ts (EXPOSED!)
GOOGLE_GENERATIVE_AI_API_KEY=xxx      # utils/embeddings.ts, app/api/chat/route.ts
```

---

## 🎯 Migration Strategy

### Option A: Keep Same Embedding Dimensions ✅ SELECTED
- `nomic-embed-text` produces 768-dim vectors (same as `text-embedding-004`)
- **No Pinecone re-indexing needed**
- Existing PDF embeddings will work with new model

### Option B: Re-index with Different Embeddings
- Would require deleting all Pinecone vectors
- Re-uploading all PDFs
- More work but potentially better quality

---

## 📦 Prerequisites

### 1. Install Ollama
```bash
# macOS
brew install ollama

# Or download from https://ollama.ai/download
```

### 2. Start Ollama Service
```bash
ollama serve
```

### 3. Pull Required Models
```bash
# Text generation (choose based on your hardware)
ollama pull llama3.1:70b    # Best quality, requires ~40GB VRAM
# OR
ollama pull llama3.1:8b     # Faster, requires ~5GB VRAM

# Embeddings (768 dimensions - same as Gemini)
ollama pull nomic-embed-text
```

### 4. Verify Models Are Running
```bash
# Test text generation
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.1:70b",
  "prompt": "Hello, world!",
  "stream": false
}'

# Test embeddings
curl http://localhost:11434/api/embeddings -d '{
  "model": "nomic-embed-text",
  "prompt": "Hello, world!"
}'
```

---

## 🔧 Implementation Steps

### Step 1: Create Ollama Client Utility
Create `lib/server/ollama.ts` - Server-only Ollama client

### Step 2: Create Ollama Embeddings Utility
Create `utils/ollama-embeddings.ts` - Embedding generation via Ollama

### Step 3: Update Chat API
Modify `app/api/chat/route.ts` to use Ollama

### Step 4: Update GeminiAIModal (Rename to LLMModal)
Modify `utils/GeminiAIModal.ts` → `utils/LLMModal.ts`

### Step 5: Update Environment Variables
```bash
# New variables
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:70b
OLLAMA_EMBEDDING_MODEL=nomic-embed-text

# Remove old variables (after migration complete)
# GEMINI_API_KEY
# NEXT_PUBLIC_GEMINI_API_KEY
# GOOGLE_GENERATIVE_AI_API_KEY
```

### Step 6: Update All Consumer Files
- Update imports in all files that use `chatSession`

### Step 7: Test Everything
- [ ] Chat functionality
- [ ] Interview generation
- [ ] Technical question generation
- [ ] Behavioral feedback
- [ ] Code evaluation
- [ ] PDF embeddings

---

## 📁 Files to Create/Modify

### New Files
1. `lib/server/ollama.ts` - Server-only Ollama client
2. `utils/ollama-embeddings.ts` - Embeddings via Ollama

### Modified Files
1. `utils/GeminiAIModal.ts` → Keep for backwards compat, internally use Ollama
2. `utils/embeddings.ts` - Switch to Ollama embeddings
3. `app/api/chat/route.ts` - Use Ollama for streaming
4. `lib/server/gemini.ts` - Deprecate or update to use Ollama

---

## ⚠️ Known Limitations & Considerations

### Hardware Requirements
| Model | VRAM Required | RAM Required |
|-------|---------------|--------------|
| `llama3.1:70b` | ~40GB | ~80GB |
| `llama3.1:8b` | ~5GB | ~10GB |
| `nomic-embed-text` | ~1GB | ~2GB |

### Performance Considerations
- Ollama runs locally, so latency depends on your hardware
- First request may be slow (model loading)
- Consider using `llama3.1:8b` for faster responses

### Fallback Strategy
- Keep Gemini code for fallback (commented out)
- Can switch back by changing environment variables

---

## 📊 Progress Tracking

| Step | Description | Status | Notes |
|------|-------------|--------|-------|
| 1 | Install Ollama | ⏳ | User needs to install |
| 2 | Create `lib/server/ollama.ts` | ✅ | Server-only Ollama client |
| 3 | Create `utils/ollama-embeddings.ts` | ✅ | Ollama embeddings utility |
| 4 | Create `utils/LLMModal.ts` | ✅ | New unified LLM interface |
| 5 | Create `/api/llm/generate/route.ts` | ✅ | API proxy for client-side |
| 6 | Create `/api/llm/health/route.ts` | ✅ | Health check endpoint |
| 7 | Update `utils/GeminiAIModal.ts` | ✅ | Now uses Ollama via API |
| 8 | Update `utils/embeddings.ts` | ✅ | Now uses Ollama embeddings |
| 9 | Update `app/api/chat/route.ts` | ✅ | Now uses Ollama streaming |
| 10 | Create `.env.ollama.example` | ✅ | Example env file |
| 11 | Test chat functionality | ⏳ | Requires Ollama running |
| 12 | Test interview generation | ⏳ | Requires Ollama running |
| 13 | Test embeddings | ⏳ | Requires Ollama running |
| 14 | Commit & push to GitHub | ⏳ | After testing |

---

## 🔗 References

- [Ollama Documentation](https://ollama.ai/)
- [Llama 3.1 Model Card](https://ollama.ai/library/llama3.1)
- [Nomic Embed Text](https://ollama.ai/library/nomic-embed-text)
- [Ollama API Reference](https://github.com/ollama/ollama/blob/main/docs/api.md)
