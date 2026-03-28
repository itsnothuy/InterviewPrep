# Resizable Columns Investigation & Implementation Plan

**Date:** January 18, 2026  
**Objective:** Implement ChatGPT-style resizable columns in `app/chat/[chatId]/page.tsx`

---

## Current State Analysis

### Current Layout (app/chat/[chatId]/page.tsx)

```tsx
<div className="flex w-full bg-bg pt-10 mt-8" style={{ height: "calc(100vh - 50px)" }}>
  <div className="flex w-full h-full">
    {/* chat sidebar - Fixed width with flex-[2] */}
    <div className="flex-[2] max-w-xs h-full overflow-y-auto hide-scrollbar">
      <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
    </div>
    
    {/* pdf viewer - Fixed width with flex-[6] */}
    <div className="h-full flex-[6] overflow-y-auto hide-scrollbar">
      <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
    </div>
    
    {/* chat component - Fixed width with flex-[3] */}
    <div className="flex-[3] overflow-y-auto hide-scrollbar">
      <ChatComponent chatId={parseInt(chatId)} />
    </div>
  </div>
</div>
```

**Current Issues:**
- ❌ Fixed flex ratios (2:6:3) - not user-adjustable
- ❌ No resize handles between panels
- ❌ No way to collapse/expand panels
- ❌ Width not persisted across sessions

---

## Research: Open-Source ChatGPT-Style Implementations

### Key Patterns from NextChat & Open WebUI

**1. Drag-to-Resize Pattern:**
```typescript
// Canonical resize logic (React pattern)
function useSidebarResize() {
  const [width, setWidth] = useState(loadWidth() ?? 300);

  const onMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = width;

    const onMove = (ev: MouseEvent) => {
      const next = startWidth + (ev.clientX - startX);
      setWidth(clamp(next, 240, 520)); // Min 240px, Max 520px
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      saveWidth(width);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return { width, onMouseDown };
}
```

**2. Building Blocks:**
- **Resize Handle:** A thin (4-8px) div positioned between panels
- **Width State:** Stored in localStorage or state management
- **Min/Max Constraints:** Prevent panels from becoming too small/large
- **Cursor Feedback:** `cursor-col-resize` on hover
- **Active State:** Visual feedback during drag

---

## Implementation Strategy

### Option A: Simple Two-Column Resize (Sidebar + Main Content)

**Complexity:** ⭐⭐ Low  
**Time:** 2-3 hours

Resize only the sidebar, let PDF + Chat share remaining space:

```
┌─────────────┬────────────────────────────────┐
│  Sidebar    │║  PDF (flex-grow)  │ Chat      │
│  (resizable)│║                   │ (fixed)   │
└─────────────┴────────────────────────────────┘
              ↑ Resize handle
```

### Option B: Three-Column Resize (Full Control)

**Complexity:** ⭐⭐⭐⭐ High  
**Time:** 6-8 hours

Resize all three panels independently:

```
┌──────────┬─────────────────┬──────────┐
│ Sidebar  │║  PDF Viewer    │║  Chat   │
│          │║                │║         │
└──────────┴─────────────────┴──────────┘
           ↑                 ↑
        Handle 1          Handle 2
```

**Challenges:**
- Coordinate two resize handles
- Prevent panels from overlapping
- More complex constraint logic

---

## Recommended Implementation: Option A (Sidebar Resize)

### Step 1: Create Resize Hook

**File:** `hooks/useResizable.ts` (NEW)

```typescript
'use client';

import { useState, useCallback, useEffect } from 'react';

interface UseResizableOptions {
  initialWidth: number;
  minWidth: number;
  maxWidth: number;
  storageKey?: string;
}

export function useResizable({
  initialWidth,
  minWidth,
  maxWidth,
  storageKey,
}: UseResizableOptions) {
  // Load saved width from localStorage
  const [width, setWidth] = useState(() => {
    if (typeof window === 'undefined') return initialWidth;
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) return parseInt(saved, 10);
    }
    return initialWidth;
  });

  const [isResizing, setIsResizing] = useState(false);

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = startWidth + deltaX;
      const clampedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
      setWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      // Save to localStorage
      if (storageKey) {
        localStorage.setItem(storageKey, width.toString());
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [width, minWidth, maxWidth, storageKey]);

  return { width, isResizing, startResize };
}
```

### Step 2: Create Resize Handle Component

**File:** `components/ui/resize-handle.tsx` (NEW)

```typescript
'use client';

import { cn } from '@/lib/utils';

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  isResizing: boolean;
}

export function ResizeHandle({ onMouseDown, isResizing }: ResizeHandleProps) {
  return (
    <div
      className={cn(
        "relative w-1 bg-transparent hover:bg-blue-500/30 transition-colors cursor-col-resize flex-shrink-0 group",
        isResizing && "bg-blue-500/50"
      )}
      onMouseDown={onMouseDown}
    >
      {/* Visual indicator on hover */}
      <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-0.5 h-12 bg-blue-500 rounded-full" />
      </div>
    </div>
  );
}
```

### Step 3: Update Chat Page

**File:** `app/chat/[chatId]/page.tsx` (MODIFIED)

Changes needed:
1. Convert to client component (required for hooks)
2. Add resize hook
3. Add resize handle
4. Use dynamic width instead of flex ratios

**Key Changes:**
```tsx
'use client'; // ADD THIS

import { useResizable } from '@/hooks/useResizable';
import { ResizeHandle } from '@/components/ui/resize-handle';

// Inside component:
const { width: sidebarWidth, isResizing, startResize } = useResizable({
  initialWidth: 280,
  minWidth: 200,
  maxWidth: 400,
  storageKey: 'chat-sidebar-width',
});

return (
  <div className="flex w-full bg-bg pt-10 mt-8" style={{ height: "calc(100vh - 50px)" }}>
    <div className="flex w-full h-full">
      {/* Sidebar with dynamic width */}
      <div 
        className="h-full overflow-y-auto hide-scrollbar flex-shrink-0"
        style={{ width: `${sidebarWidth}px` }}
      >
        <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
      </div>
      
      {/* Resize Handle */}
      <ResizeHandle onMouseDown={startResize} isResizing={isResizing} />
      
      {/* Main content (PDF + Chat) */}
      <div className="flex flex-1 h-full overflow-hidden">
        <div className="h-full flex-[6] overflow-y-auto hide-scrollbar">
          <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        </div>
        <div className="flex-[3] overflow-y-auto hide-scrollbar">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  </div>
);
```

---

## Implementation Challenges & Solutions

### Challenge 1: Server Component → Client Component

**Problem:** Current `page.tsx` is a server component (uses `await getServerSession`)

**Solution:** Split into two components:
- `page.tsx` - Server component (fetch data)
- `ChatLayout.tsx` - Client component (resizable UI)

### Challenge 2: Session Data in Client Component

**Problem:** Client components can't use `getServerSession`

**Solution:** Pass session data as props from server component:

```tsx
// page.tsx (Server Component)
const ChatPage = async ({ params: { chatId } }: Props) => {
  const session = await getServerSession(authConfig);
  // ... fetch data ...
  
  return <ChatLayout session={session} chats={_chats} currentChat={currentChat} />;
};

// ChatLayout.tsx (Client Component)
'use client';
export function ChatLayout({ session, chats, currentChat }) {
  // Resizable logic here
}
```

### Challenge 3: TypeScript Types

**Problem:** Need proper types for all props

**Solution:** Create shared type definitions:

```typescript
// types/chat.ts
export interface Chat {
  id: number;
  userId: string;
  pdfName: string;
  pdfUrl: string;
  fileKey: string;
  createdAt: Date;
}

export interface ChatLayoutProps {
  chats: Chat[];
  chatId: number;
  currentChat: Chat;
}
```

---

## Testing Plan

### Manual Testing
- [ ] Drag sidebar resize handle left/right
- [ ] Verify min width (200px) prevents sidebar from disappearing
- [ ] Verify max width (400px) prevents sidebar from taking over screen
- [ ] Refresh page - verify width is persisted
- [ ] Test on different screen sizes (laptop, desktop, ultrawide)
- [ ] Verify PDF and Chat panels still scroll independently
- [ ] Test with long chat lists in sidebar

### Edge Cases
- [ ] What happens when window width < 800px? (mobile)
- [ ] Does resize work with keyboard navigation?
- [ ] Cursor feedback during resize
- [ ] Visual feedback (handle highlight)

---

## Accessibility Considerations

```tsx
<div
  role="separator"
  aria-orientation="vertical"
  aria-label="Resize sidebar"
  aria-valuemin={minWidth}
  aria-valuemax={maxWidth}
  aria-valuenow={width}
  tabIndex={0}
  onKeyDown={handleKeyboardResize} // Arrow keys to resize
  className="resize-handle"
  onMouseDown={startResize}
>
```

---

## Performance Considerations

**Throttle mousemove events:**
```typescript
import { throttle } from 'lodash';

const handleMouseMove = throttle((moveEvent: MouseEvent) => {
  // ... resize logic
}, 16); // ~60fps
```

---

## Alternative: Use Existing Library

**react-resizable-panels** by Brian Vaughn (creator of react-virtualized)

```bash
npm install react-resizable-panels
```

```tsx
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

<PanelGroup direction="horizontal">
  <Panel defaultSize={20} minSize={15} maxSize={30}>
    <ChatSideBar />
  </Panel>
  <PanelResizeHandle />
  <Panel defaultSize={55}>
    <PDFViewer />
  </Panel>
  <Panel defaultSize={25}>
    <ChatComponent />
  </Panel>
</PanelGroup>
```

**Pros:**
- ✅ Battle-tested
- ✅ Handles edge cases
- ✅ Keyboard navigation built-in
- ✅ Collapse/expand animations
- ✅ Persistence built-in

**Cons:**
- ❌ Another dependency (12KB gzipped)
- ❌ Less control over styling

---

## Recommendation

**For Learning:** Implement custom resize hook (Option A, Steps 1-3)
- ✅ Understand the mechanics
- ✅ Full control
- ✅ ~3 hours of work

**For Production:** Use `react-resizable-panels`
- ✅ Faster implementation
- ✅ More robust
- ✅ ~30 minutes of work

---

## Next Steps

1. **Choose implementation approach** (custom vs library)
2. **Create hook/install library**
3. **Split page.tsx into server + client components**
4. **Implement resize UI**
5. **Test thoroughly**
6. **Document changes**

Let me know which approach you prefer, and I'll implement it step-by-step with full transparency about each decision.
