# CodePair Frontend Blueprint - Part 2: Interview Session Interface

> **Documentation Type**: Pixel-Perfect Rebuild Blueprint  
> **Coverage**: Interview Session Components  
> **Precision Level**: Microscopic - All CSS classes, dimensions, colors, animations documented exactly as implemented  
> **Date**: 2024  
> **Tech Stack**: React 18 + TypeScript + Tailwind CSS + Vite

---

## Table of Contents

1. [Toast Notification System](#1-toast-notification-system)
2. [Interview Session Layout](#2-interview-session-layout)
3. [Video/Audio Controls](#3-video-audio-controls)
4. [Panel Resizer System](#4-panel-resizer-system)
5. [TabView Component (Chat/Log Tabs)](#5-tabview-component)
6. [Chat Component](#6-chat-component)
7. [Code Editor Header](#7-code-editor-header)

---

## 1. Toast Notification System

### 1.1 Toast Component (`Toast.tsx`)

**File Location**: `client-cp/src/components/common/Toast.tsx`

#### Component Structure
```tsx
interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: (id: string) => void;
  duration?: number;
}
```

#### Container Styling
```tsx
className="w-[400px] bg-[#161616] border border-[#393939] shadow-lg rounded-sm 
          flex items-start gap-4 p-4 relative overflow-hidden 
          animate-slideIn hover:shadow-xl transition-shadow"
```

**Breakdown**:
- **Width**: `w-[400px]` = 400px fixed width
- **Background**: `bg-[#161616]` = Primary background color
- **Border**: `border border-[#393939]` = 1px solid #393939
- **Shadow**: `shadow-lg` = Large drop shadow
- **Corners**: `rounded-sm` = 2px border radius
- **Layout**: `flex items-start` = Flexbox, align items to top
- **Gap**: `gap-4` = 16px gap between icon and content
- **Padding**: `p-4` = 16px padding all sides
- **Positioning**: `relative` = For progress bar positioning
- **Overflow**: `overflow-hidden` = Hide overflowing progress bar
- **Animation**: `animate-slideIn` = Custom slide-in animation
- **Hover**: `hover:shadow-xl` = Extra large shadow on hover
- **Transition**: `transition-shadow` = Smooth shadow transition

#### Type-Specific Border Styling

**Success Toast**:
```tsx
className="border-l-4 border-l-[#42be65]"
```
- Left border: 4px solid #42be65 (IBM Carbon success green)

**Error Toast**:
```tsx
className="border-l-4 border-l-[#fa4d56]"
```
- Left border: 4px solid #fa4d56 (IBM Carbon error red)

**Warning Toast**:
```tsx
className="border-l-4 border-l-[#f1c21b]"
```
- Left border: 4px solid #f1c21b (IBM Carbon warning yellow)

**Info Toast**:
```tsx
className="border-l-4 border-l-[#0f62fe]"
```
- Left border: 4px solid #0f62fe (IBM Carbon primary blue)

#### Icon Container Styling
```tsx
className="flex-shrink-0 w-5 h-5"
```
- **Shrink**: `flex-shrink-0` = Prevent icon from shrinking
- **Size**: `w-5 h-5` = 20px × 20px

**Icon Colors**:
- Success: `text-[#42be65]` (CheckCircle icon)
- Error: `text-[#fa4d56]` (XCircle icon)
- Warning: `text-[#f1c21b]` (AlertTriangle icon)
- Info: `text-[#0f62fe]` (Info icon)

#### Message Text Styling
```tsx
className="flex-1 text-sm text-[#f4f4f4]"
```
- **Flex**: `flex-1` = Take remaining space
- **Font Size**: `text-sm` = 14px
- **Color**: `text-[#f4f4f4]` = Off-white text

#### Close Button Styling
```tsx
className="flex-shrink-0 text-[#8d8d8d] hover:text-[#f4f4f4] 
          transition-colors cursor-pointer"
```
- **Shrink**: `flex-shrink-0` = Fixed size
- **Default Color**: `text-[#8d8d8d]` = Gray
- **Hover Color**: `hover:text-[#f4f4f4]` = Off-white
- **Transition**: `transition-colors` = Smooth color change
- **Cursor**: `cursor-pointer` = Pointer cursor

Close icon (X):
```tsx
<X size={16} />
```
- Size: 16px × 16px

#### Progress Bar Styling
```tsx
className="absolute bottom-0 left-0 h-0.5 bg-[#0f62fe] 
          transition-all animate-shrink"
style={{ width: `${progress}%` }}
```
- **Position**: `absolute bottom-0 left-0` = Bottom-left corner
- **Height**: `h-0.5` = 2px height
- **Background**: `bg-[#0f62fe]` = IBM Carbon primary blue
- **Transition**: `transition-all` = Smooth width animation
- **Animation**: `animate-shrink` = Custom shrink animation
- **Width**: Dynamic percentage based on progress state

#### Animations

**slideIn Animation** (defined in `tailwind.config.js` or CSS):
```css
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```
- Duration: 200ms
- Easing: ease-out

**shrink Animation**:
```css
@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
```
- Duration: Matches toast duration (2000ms-4000ms)
- Easing: linear

---

### 1.2 Toast Context (`ToastContext.tsx`)

**File Location**: `client-cp/src/context/ToastContext.tsx`

#### Toast Duration Logic
```typescript
const defaultDurations = {
  success: 2000, // 2 seconds
  error: 4000,   // 4 seconds
  warning: 3000, // 3 seconds
  info: 3000     // 3 seconds
};
```

#### Toast ID Generation
```typescript
const id = Math.random().toString(36).substr(2, 9);
```
- Generates random 9-character alphanumeric ID

#### Show Toast Method
```typescript
show: (message: string, type: ToastType, duration?: number) => {
  const id = Math.random().toString(36).substr(2, 9);
  const toastDuration = duration || defaultDurations[type];
  
  setToasts(prev => [...prev, { id, message, type, duration: toastDuration }]);
}
```

---

### 1.3 Toast Container (`ToastContainer.tsx`)

**File Location**: `client-cp/src/components/common/ToastContainer.tsx`

#### Container Styling
```tsx
className="fixed bottom-0 right-0 z-50 p-6 flex flex-col gap-3"
```
- **Position**: `fixed bottom-0 right-0` = Fixed to bottom-right corner
- **Z-Index**: `z-50` = High stacking order (appears above most elements)
- **Padding**: `p-6` = 24px padding
- **Layout**: `flex flex-col` = Vertical stack
- **Gap**: `gap-3` = 12px gap between toasts

#### Staggered Animation Delay
```tsx
style={{ animationDelay: `${index * 100}ms` }}
```
- Each toast delayed by 100ms × its index
- Creates cascading effect when multiple toasts appear

---

### 1.4 Testing Toast Notifications

**Test Cases**:
1. **Success Toast**: Appears bottom-right, green left border, 2s duration
2. **Error Toast**: Appears bottom-right, red left border, 4s duration
3. **Warning Toast**: Appears bottom-right, yellow left border, 3s duration
4. **Info Toast**: Appears bottom-right, blue left border, 3s duration
5. **Multiple Toasts**: Stack vertically with 12px gap, staggered animation
6. **Hover Behavior**: Shadow increases on hover
7. **Close Button**: Closes toast immediately, color changes on hover
8. **Progress Bar**: Shrinks from 100% to 0% over toast duration
9. **Auto Dismiss**: Toast removes itself after duration expires

---

## 2. Interview Session Layout

### 2.1 Main Layout Structure (`$roomId.tsx`)

**File Location**: `client-cp/src/routes/$roomId.tsx`

#### Root Container
```tsx
className="flex h-screen bg-[#161616]"
```
- **Layout**: `flex` = Flexbox container (horizontal by default)
- **Height**: `h-screen` = 100vh (full viewport height)
- **Background**: `bg-[#161616]` = Primary dark background

#### Left Sidebar (Video/Chat Column)
```tsx
className="hidden md:flex flex-col w-80 bg-[#262626] border-r border-[#393939]"
```
- **Visibility**: `hidden md:flex` = Hidden on mobile (<768px), visible on md+ (≥768px)
- **Layout**: `flex-col` = Vertical stack
- **Width**: `w-80` = 320px fixed width
- **Background**: `bg-[#262626]` = Secondary dark background
- **Border**: `border-r border-[#393939]` = 1px right border

#### Room Info Section (Top of Sidebar)
```tsx
className="p-4 border-b border-[#393939]"
```
- **Padding**: `p-4` = 16px all sides
- **Border**: `border-b border-[#393939]` = 1px bottom border

**Room Title**:
```tsx
className="text-sm font-medium text-[#f4f4f4] mb-1"
```
- **Font Size**: `text-sm` = 14px
- **Weight**: `font-medium` = 500
- **Color**: `text-[#f4f4f4]` = Off-white
- **Margin**: `mb-1` = 4px bottom margin

**Status Tag**:
```tsx
// Active status
className="inline-block px-2 py-0.5 text-xs font-medium rounded-full 
          bg-[#198038] text-white"

// Ended status
className="inline-block px-2 py-0.5 text-xs font-medium rounded-full 
          bg-[#8d8d8d] text-white"
```

**Active Status**:
- **Display**: `inline-block` = Inline-level block container
- **Padding**: `px-2 py-0.5` = 8px horizontal, 2px vertical
- **Font Size**: `text-xs` = 12px
- **Weight**: `font-medium` = 500
- **Corners**: `rounded-full` = Fully rounded pill shape
- **Background**: `bg-[#198038]` = IBM Carbon success green (darker shade)
- **Text Color**: `text-white` = White

**Ended Status**:
- Same styling except background: `bg-[#8d8d8d]` = Gray

#### Video Section (Middle of Sidebar)
```tsx
className="p-4 space-y-4"
```
- **Padding**: `p-4` = 16px all sides
- **Spacing**: `space-y-4` = 16px vertical gap between children

**Video Label**:
```tsx
className="text-xs text-[#c6c6c6] font-medium"
```
- **Font Size**: `text-xs` = 12px
- **Color**: `text-[#c6c6c6]` = Light gray
- **Weight**: `font-medium` = 500

**VideoStream Component Container**:
```tsx
className="space-y-2"
```
- **Spacing**: `space-y-2` = 8px vertical gap

**VideoStream Styling**:
```tsx
className="rounded-sm border border-[#393939] w-full h-32 shadow-lg bg-[#161616]"
```
- **Corners**: `rounded-sm` = 2px border radius
- **Border**: `border border-[#393939]` = 1px solid border
- **Width**: `w-full` = 100% of parent
- **Height**: `h-32` = 128px fixed height
- **Shadow**: `shadow-lg` = Large drop shadow
- **Background**: `bg-[#161616]` = Primary dark background (fallback when no stream)

---

### 2.2 Video/Audio Controls

#### Controls Container
```tsx
className="flex justify-center space-x-3 py-2"
```
- **Layout**: `flex` = Flexbox
- **Justify**: `justify-center` = Center horizontally
- **Spacing**: `space-x-3` = 12px horizontal gap
- **Padding**: `py-2` = 8px vertical padding

#### Camera Button (On State)
```tsx
className="p-2.5 rounded-full bg-[#393939] hover:bg-[#4d4d4d] 
          transition-colors focus:outline-none focus:ring-2 
          focus:ring-[#0f62fe] focus:ring-offset-2 
          focus:ring-offset-[#262626]"
```
- **Padding**: `p-2.5` = 10px all sides
- **Shape**: `rounded-full` = Circular button
- **Background**: `bg-[#393939]` = Dark gray
- **Hover**: `hover:bg-[#4d4d4d]` = Lighter gray
- **Transition**: `transition-colors` = Smooth color change
- **Focus**: `focus:outline-none` = Remove default outline
- **Focus Ring**: `focus:ring-2 focus:ring-[#0f62fe]` = 2px blue ring
- **Ring Offset**: `focus:ring-offset-2` = 2px offset from button
- **Offset Color**: `focus:ring-offset-[#262626]` = Matches sidebar background

**Icon Size**:
```tsx
<Camera size={18} />
```
- Size: 18px × 18px

#### Camera Button (Off State)
```tsx
className="p-2.5 rounded-full bg-[#da1e28] hover:bg-[#bc1a23] 
          transition-colors focus:outline-none focus:ring-2 
          focus:ring-[#0f62fe] focus:ring-offset-2 
          focus:ring-offset-[#262626]"
```
- Same styling as on state except:
- **Background**: `bg-[#da1e28]` = IBM Carbon error red
- **Hover**: `hover:bg-[#bc1a23]` = Darker red

**Icon**:
```tsx
<CameraOff size={18} />
```
- Size: 18px × 18px

#### Microphone Buttons
- **Same styling as camera buttons**
- Icons: `<Mic size={18} />` and `<MicOff size={18} />`

---

### 2.3 TabView Section (Bottom of Sidebar)

```tsx
className="flex-1 px-4"
```
- **Flex**: `flex-1` = Take remaining vertical space
- **Padding**: `px-4` = 16px horizontal padding

---

### 2.4 Clock & End Interview Section

#### Container
```tsx
className="p-4 border-t border-[#393939] bg-[#262626]"
```
- **Padding**: `p-4` = 16px all sides
- **Border**: `border-t border-[#393939]` = 1px top border
- **Background**: `bg-[#262626]` = Secondary dark background

#### Layout
```tsx
className="flex items-center justify-between"
```
- **Layout**: `flex` = Flexbox
- **Align**: `items-center` = Vertically center items
- **Justify**: `justify-between` = Space between Clock and End button

#### End Interview Button
```tsx
className="inline-flex items-center h-[32px] px-4 text-xs font-medium 
          bg-[#da1e28] text-white border border-transparent 
          hover:bg-[#bc1a23] transition-colors duration-200 
          focus:outline-none focus:ring-2 focus:ring-offset-2 
          focus:ring-[#fa4d56] focus:ring-offset-[#262626] 
          disabled:opacity-50 disabled:cursor-not-allowed"
```
- **Display**: `inline-flex items-center` = Inline flexbox, center content
- **Height**: `h-[32px]` = 32px fixed height
- **Padding**: `px-4` = 16px horizontal padding
- **Font Size**: `text-xs` = 12px
- **Weight**: `font-medium` = 500
- **Background**: `bg-[#da1e28]` = IBM Carbon error red
- **Text Color**: `text-white` = White
- **Border**: `border border-transparent` = Transparent border (for consistent sizing)
- **Hover**: `hover:bg-[#bc1a23]` = Darker red
- **Transition**: `transition-colors duration-200` = 200ms color transition
- **Focus**: `focus:outline-none` = Remove default outline
- **Focus Ring**: `focus:ring-2 focus:ring-[#fa4d56]` = 2px lighter red ring
- **Ring Offset**: `focus:ring-offset-2 focus:ring-offset-[#262626]` = 2px offset
- **Disabled**: `disabled:opacity-50 disabled:cursor-not-allowed` = 50% opacity, not-allowed cursor

---

## 3. Video Audio Controls

### 3.1 Control Panel Layout

#### Container
```tsx
className="flex justify-center space-x-3 py-2"
```
- **Layout**: `flex` = Horizontal flexbox
- **Justify**: `justify-center` = Center buttons horizontally
- **Spacing**: `space-x-3` = 12px gap between buttons
- **Padding**: `py-2` = 8px vertical padding

### 3.2 Button States

#### Base Button Styling (Common to all states)
```tsx
className="p-2.5 rounded-full transition-colors 
          focus:outline-none focus:ring-2 focus:ring-[#0f62fe] 
          focus:ring-offset-2 focus:ring-offset-[#262626]"
```

#### Active State (Webcam/Mic On)
```tsx
className="... bg-[#393939] hover:bg-[#4d4d4d] ..."
```
- **Background**: `bg-[#393939]` = #393939 (dark gray)
- **Hover**: `hover:bg-[#4d4d4d]` = #4d4d4d (lighter gray)

#### Inactive State (Webcam/Mic Off)
```tsx
className="... bg-[#da1e28] hover:bg-[#bc1a23] ..."
```
- **Background**: `bg-[#da1e28]` = #da1e28 (IBM Carbon danger red)
- **Hover**: `hover:bg-[#bc1a23]` = #bc1a23 (darker red)

### 3.3 Icon Specifications

**Lucide React Icons**:
- Camera: `<Camera size={18} />`
- CameraOff: `<CameraOff size={18} />`
- Mic: `<Mic size={18} />`
- MicOff: `<MicOff size={18} />`

All icons: 18px × 18px

### 3.4 Button Dimensions
- **Padding**: `p-2.5` = 10px all sides
- **Total Size**: 10px + 18px (icon) + 10px = 38px diameter
- **Shape**: Circular (rounded-full)

### 3.5 Focus Ring Details
- **Ring Width**: `focus:ring-2` = 2px
- **Ring Color**: `focus:ring-[#0f62fe]` = IBM Carbon primary blue
- **Ring Offset**: `focus:ring-offset-2` = 2px gap between button and ring
- **Offset Color**: `focus:ring-offset-[#262626]` = Matches sidebar background

---

## 4. Panel Resizer System

### 4.1 State Management

#### Width State
```typescript
const [editorWidth, setEditorWidth] = useState<number>(50);
```
- Default: 50% (50/50 split)
- Range: 30% - 70%

#### Dragging State
```typescript
const isDragging = useRef<boolean>(false);
```
- Tracks if user is actively dragging

#### Main Content Ref
```typescript
const mainContentRef = useRef<HTMLDivElement>(null);
```
- Reference to main content container for dimension calculations

### 4.2 Mouse Event Handlers

#### handleMouseDown
```typescript
const handleMouseDown = (e: React.MouseEvent) => {
  e.preventDefault();
  isDragging.current = true;
  document.body.style.cursor = "col-resize";
  document.body.classList.add("resizing");
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};
```

**Actions**:
1. Prevent default click behavior
2. Set dragging state to true
3. Change cursor to `col-resize` (resize cursor)
4. Add `.resizing` class to body (prevents text selection)
5. Attach mousemove and mouseup listeners

#### handleMouseMove
```typescript
const handleMouseMove = useCallback((e: MouseEvent) => {
  if (!isDragging.current || !mainContentRef.current) return;

  const containerRect = mainContentRef.current.getBoundingClientRect();
  const mouseX = e.clientX - containerRect.left;
  const totalWidth = containerRect.width;

  let percentage = (mouseX / totalWidth) * 100;
  percentage = 100 - percentage; // Invert percentage
  const newWidth = Math.min(Math.max(percentage, 30), 70);
  setEditorWidth(newWidth);
}, []);
```

**Calculation Logic**:
1. Get mouse X position relative to container left edge
2. Calculate percentage: (mouseX / totalWidth) × 100
3. Invert percentage: 100 - percentage (because editor is on right)
4. Clamp to 30%-70% range using `Math.min(Math.max(percentage, 30), 70)`
5. Update editor width state

#### handleMouseUp
```typescript
const handleMouseUp = useCallback(() => {
  isDragging.current = false;
  document.body.style.cursor = "default";
  document.body.classList.remove("resizing");
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
}, [handleMouseMove]);
```

**Actions**:
1. Set dragging state to false
2. Reset cursor to default
3. Remove `.resizing` class from body
4. Remove mousemove and mouseup listeners

### 4.3 Resizing CSS Class

**File**: `client-cp/src/app.css`

```css
.resizing {
  user-select: none !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
}
```

**Purpose**: Prevents text selection during drag operation

### 4.4 Resizer Handle Styling

```tsx
className="absolute right-0 top-0 w-1 h-full bg-[#393939] 
          hover:bg-[#0f62fe] cursor-col-resize transition-colors"
onMouseDown={handleMouseDown}
style={{ userSelect: "none", touchAction: "none" }}
```

**Breakdown**:
- **Position**: `absolute right-0 top-0` = Right edge of writing space
- **Width**: `w-1` = 4px width (Tailwind w-1 = 4px)
- **Height**: `h-full` = 100% of parent height
- **Default Color**: `bg-[#393939]` = Dark gray
- **Hover Color**: `hover:bg-[#0f62fe]` = IBM Carbon primary blue
- **Cursor**: `cursor-col-resize` = Column resize cursor
- **Transition**: `transition-colors` = Smooth color change
- **Inline Styles**: 
  - `userSelect: "none"` = Prevent text selection
  - `touchAction: "none"` = Prevent touch gestures

### 4.5 Main Content Area Layout

```tsx
<div
  ref={mainContentRef}
  className="flex-1 flex flex-col md:flex-row min-w-0 bg-[#262626]"
>
```

**Breakdown**:
- **Flex**: `flex-1` = Take remaining space after sidebar
- **Layout**: `flex flex-col md:flex-row` = Vertical on mobile, horizontal on desktop
- **Min Width**: `min-w-0` = Allow flexbox shrinking
- **Background**: `bg-[#262626]` = Secondary dark background

### 4.6 Writing Space (Notes Panel)

```tsx
<div
  style={{ width: isMobile ? "100%" : `${100 - editorWidth}%` }}
  className={`relative min-w-[30%] ${isMobile ? "h-1/2" : "h-full"} 
             border-b md:border-b-0 md:border-r border-[#393939] bg-[#161616]`}
>
```

**Breakdown**:
- **Width**: Dynamic - `100 - editorWidth` percentage (on desktop), 100% on mobile
- **Position**: `relative` = For resizer handle positioning
- **Min Width**: `min-w-[30%]` = Minimum 30% width
- **Height**: `h-1/2` (mobile) or `h-full` (desktop)
- **Border**: `border-b md:border-b-0 md:border-r border-[#393939]`
  - Mobile: Bottom border
  - Desktop: Right border
- **Background**: `bg-[#161616]` = Primary dark background

### 4.7 Code Editor Panel

```tsx
<div
  style={{
    width: isMobile ? "100%" : `${editorWidth}%`,
    height: isMobile ? "50%" : "100%",
  }}
  className="flex flex-col min-w-[30%] bg-[#161616]"
>
```

**Breakdown**:
- **Width**: Dynamic - `editorWidth` percentage (on desktop), 100% on mobile
- **Height**: 50% (mobile) or 100% (desktop)
- **Layout**: `flex flex-col` = Vertical stack (header + editor)
- **Min Width**: `min-w-[30%]` = Minimum 30% width
- **Background**: `bg-[#161616]` = Primary dark background

### 4.8 Mobile Responsiveness

#### Breakpoint
- **Desktop**: `md:` prefix = ≥768px (Tailwind default)
- **Mobile**: No prefix = <768px

#### Mobile Layout
```typescript
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
```

**Mobile Behavior**:
- No resizer (hidden with `{!isMobile && <ResizeHandle />}`)
- Panels stack vertically (50/50 height split)
- Left sidebar hidden (`hidden md:flex`)

---

## 5. TabView Component

**File Location**: `client-cp/src/components/rooms/TabView.tsx`

### 5.1 Container Styling

```tsx
className="h-full flex flex-col bg-[#262626] rounded-lg overflow-hidden"
```
- **Height**: `h-full` = 100% of parent
- **Layout**: `flex flex-col` = Vertical stack
- **Background**: `bg-[#262626]` = Secondary dark background
- **Corners**: `rounded-lg` = 8px border radius
- **Overflow**: `overflow-hidden` = Hide content outside rounded corners

### 5.2 Tab Buttons Container

```tsx
className="flex border-b border-[#393939]"
```
- **Layout**: `flex` = Horizontal flexbox
- **Border**: `border-b border-[#393939]` = 1px bottom border

### 5.3 Tab Button Styling

#### Active Tab
```tsx
className="flex-1 px-4 py-2 text-sm font-medium 
          bg-[#393939] text-white transition-colors"
```
- **Flex**: `flex-1` = Equal width tabs
- **Padding**: `px-4 py-2` = 16px horizontal, 8px vertical
- **Font Size**: `text-sm` = 14px
- **Weight**: `font-medium` = 500
- **Background**: `bg-[#393939]` = Dark gray (active state)
- **Text Color**: `text-white` = White
- **Transition**: `transition-colors` = Smooth color change

#### Inactive Tab
```tsx
className="flex-1 px-4 py-2 text-sm font-medium 
          text-[#8d8d8d] hover:text-white hover:bg-[#353535] 
          transition-colors"
```
- **Text Color**: `text-[#8d8d8d]` = Gray
- **Hover Text**: `hover:text-white` = White on hover
- **Hover Background**: `hover:bg-[#353535]` = Slightly lighter gray
- **Transition**: `transition-colors` = Smooth color change

### 5.4 Tab Content Container

```tsx
className="flex-1 overflow-hidden relative"
```
- **Flex**: `flex-1` = Take remaining vertical space
- **Overflow**: `overflow-hidden` = Prevent content overflow
- **Position**: `relative` = For absolute positioned children

---

## 6. Chat Component

**File Location**: `client-cp/src/components/rooms/Chat.tsx`

### 6.1 Root Container

```tsx
className="absolute inset-0 flex flex-col"
```
- **Position**: `absolute inset-0` = Fill parent container
- **Layout**: `flex flex-col` = Vertical stack

### 6.2 Messages Container

```tsx
className="flex-1 overflow-y-auto custom-scrollbar"
```
- **Flex**: `flex-1` = Take remaining space above input
- **Overflow**: `overflow-y-auto` = Vertical scrolling
- **Scrollbar**: `custom-scrollbar` = Custom scrollbar styling (defined in app.css)

### 6.3 Messages Wrapper

```tsx
className="px-2"
```
- **Padding**: `px-2` = 8px horizontal padding

### 6.4 Individual Message Styling

```tsx
className={`group py-2 border-b border-[#393939] last:border-0 
           ${msg.userName === user?.name ? "bg-[#262626]" : ""}`}
```
- **Group**: `group` = Enable group-hover on children
- **Padding**: `py-2` = 8px vertical padding
- **Border**: `border-b border-[#393939]` = 1px bottom border
- **Last Child**: `last:border-0` = No border on last message
- **Current User**: `bg-[#262626]` = Slight background highlight for own messages

### 6.5 Message Header

```tsx
className="flex items-baseline justify-between mb-1"
```
- **Layout**: `flex` = Horizontal flexbox
- **Align**: `items-baseline` = Align text baselines
- **Justify**: `justify-between` = Space between username and timestamp
- **Margin**: `mb-1` = 4px bottom margin

#### Username
```tsx
className="text-xs font-medium text-[#f4f4f4]"
```
- **Font Size**: `text-xs` = 12px
- **Weight**: `font-medium` = 500
- **Color**: `text-[#f4f4f4]` = Off-white

#### Timestamp
```tsx
className="text-[11px] text-[#8d8d8d]"
```
- **Font Size**: `text-[11px]` = 11px (custom size)
- **Color**: `text-[#8d8d8d]` = Gray

### 6.6 Message Content

```tsx
className="text-sm text-[#e0e0e0] break-words"
```
- **Font Size**: `text-sm` = 14px
- **Color**: `text-[#e0e0e0]` = Light gray
- **Word Break**: `break-words` = Break long words to prevent overflow

### 6.7 Loading State

```tsx
className="absolute inset-0 flex items-center justify-center"
```
- **Position**: `absolute inset-0` = Fill entire container
- **Layout**: `flex` = Flexbox
- **Align**: `items-center` = Vertically center
- **Justify**: `justify-center` = Horizontally center

#### Loading Container
```tsx
className="flex flex-col items-center space-y-2"
```
- **Layout**: `flex flex-col` = Vertical stack
- **Align**: `items-center` = Center items horizontally
- **Spacing**: `space-y-2` = 8px vertical gap

#### Loader Icon
```tsx
<Loader size={24} className="text-[#0f62fe] animate-spin" />
```
- **Size**: 24px × 24px
- **Color**: `text-[#0f62fe]` = IBM Carbon primary blue
- **Animation**: `animate-spin` = Tailwind spin animation

#### Loading Text
```tsx
className="text-sm text-[#8d8d8d]"
```
- **Font Size**: `text-sm` = 14px
- **Color**: `text-[#8d8d8d]` = Gray

### 6.8 Error State

#### Error Container
```tsx
className="absolute inset-0 flex items-center justify-center"
```
- Same as loading state container

#### Error Wrapper
```tsx
className="flex flex-col items-center space-y-2 text-center px-4"
```
- **Layout**: `flex flex-col` = Vertical stack
- **Align**: `items-center` = Center horizontally
- **Spacing**: `space-y-2` = 8px vertical gap
- **Text**: `text-center` = Center text
- **Padding**: `px-4` = 16px horizontal padding

#### Error Message
```tsx
className="text-sm text-[#fa4d56]"
```
- **Font Size**: `text-sm` = 14px
- **Color**: `text-[#fa4d56]` = IBM Carbon error red

#### Error Hint
```tsx
className="text-xs text-[#8d8d8d]"
```
- **Font Size**: `text-xs` = 12px
- **Color**: `text-[#8d8d8d]` = Gray

### 6.9 Input Section

#### Input Container
```tsx
className="flex-shrink-0 py-3 border-t border-[#393939] bg-[#262626]"
```
- **Shrink**: `flex-shrink-0` = Fixed height (doesn't shrink)
- **Padding**: `py-3` = 12px vertical padding
- **Border**: `border-t border-[#393939]` = 1px top border
- **Background**: `bg-[#262626]` = Secondary dark background

#### Input Field
```tsx
className="w-full h-8 px-3 bg-[#161616] text-[#f4f4f4] text-sm
          border border-[#393939] hover:border-[#525252]
          focus:border-[#393939] focus:outline-none
          placeholder-[#6f6f6f] transition-colors"
```
- **Width**: `w-full` = 100% of container
- **Height**: `h-8` = 32px
- **Padding**: `px-3` = 12px horizontal padding
- **Background**: `bg-[#161616]` = Primary dark background
- **Text Color**: `text-[#f4f4f4]` = Off-white
- **Font Size**: `text-sm` = 14px
- **Border**: `border border-[#393939]` = 1px solid border
- **Hover Border**: `hover:border-[#525252]` = Lighter gray on hover
- **Focus Border**: `focus:border-[#393939]` = Same gray (no change)
- **Focus**: `focus:outline-none` = Remove default outline
- **Placeholder**: `placeholder-[#6f6f6f]` = Dark gray placeholder text
- **Transition**: `transition-colors` = Smooth border color change

---

## 7. Code Editor Header

**File Location**: `client-cp/src/routes/$roomId.tsx` (lines 396-419)

### 7.1 Header Container

```tsx
className="flex items-center justify-between p-4 border-b border-[#393939]"
```
- **Layout**: `flex` = Horizontal flexbox
- **Align**: `items-center` = Vertically center items
- **Justify**: `justify-between` = Space between title and language selector
- **Padding**: `p-4` = 16px all sides
- **Border**: `border-b border-[#393939]` = 1px bottom border

### 7.2 Header Title

```tsx
className="text-sm font-medium text-[#f4f4f4]"
```
- **Font Size**: `text-sm` = 14px
- **Weight**: `font-medium` = 500
- **Color**: `text-[#f4f4f4]` = Off-white

### 7.3 Language Selector (Select Dropdown)

```tsx
className="px-3 py-1.5 text-sm bg-[#262626] rounded-none 
          border border-[#525252] hover:bg-[#353535] transition-colors 
          focus:outline-none focus:ring-2 focus:ring-[#0f62fe] 
          appearance-none pr-8 relative"
```

**Breakdown**:
- **Padding**: `px-3 py-1.5` = 12px horizontal, 6px vertical
- **Font Size**: `text-sm` = 14px
- **Background**: `bg-[#262626]` = Secondary dark background
- **Corners**: `rounded-none` = No border radius (square corners)
- **Border**: `border border-[#525252]` = 1px solid lighter gray
- **Hover**: `hover:bg-[#353535]` = Slightly lighter on hover
- **Transition**: `transition-colors` = Smooth color change
- **Focus**: `focus:outline-none` = Remove default outline
- **Focus Ring**: `focus:ring-2 focus:ring-[#0f62fe]` = 2px blue ring
- **Appearance**: `appearance-none` = Remove default browser styling
- **Padding Right**: `pr-8` = 32px right padding (for custom arrow)
- **Position**: `relative` = For arrow positioning

### 7.4 Custom Dropdown Arrow

```tsx
style={{
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23f4f4f4'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.5rem center",
  backgroundSize: "1.5em 1.5em",
}}
```

**Arrow Details**:
- **Type**: SVG chevron-down icon (Heroicons style)
- **Color**: `%23f4f4f4` (URL-encoded #f4f4f4 off-white)
- **Position**: Right side, 8px (0.5rem) from edge, vertically centered
- **Size**: 24px × 24px (1.5em × 1.5em)

### 7.5 Editor Container

```tsx
className="flex-1 bg-[#161616]"
```
- **Flex**: `flex-1` = Take remaining vertical space
- **Background**: `bg-[#161616]` = Primary dark background

### 7.6 Monaco Editor Options

```typescript
options={{
  automaticLayout: true,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  wordWrap: "on",
  tabSize: 2,
  padding: { top: 16, bottom: 16 },
  fontFamily: '"IBM Plex Mono", monospace',
  fontSize: 14,
}}
```

**Configuration**:
- **Automatic Layout**: Adjusts editor size automatically
- **Minimap**: Disabled
- **Scroll Beyond Last Line**: Disabled
- **Word Wrap**: Enabled
- **Tab Size**: 2 spaces
- **Padding**: 16px top and bottom
- **Font Family**: IBM Plex Mono (monospace fallback)
- **Font Size**: 14px

---

## Testing Guide

### Toast Notifications Testing
1. **Trigger Success Toast**: Room created, code copied, etc.
2. **Trigger Error Toast**: Connection failures, API errors
3. **Trigger Warning Toast**: Unsaved changes warnings
4. **Trigger Info Toast**: General notifications
5. **Multiple Toasts**: Trigger several rapidly, verify stacking and animation delays
6. **Close Button**: Click X, verify immediate removal
7. **Auto Dismiss**: Wait for duration, verify automatic removal
8. **Progress Bar**: Watch progress bar shrink over duration

### Interview Layout Testing
1. **Desktop View** (≥768px):
   - Verify left sidebar 320px width
   - Verify video streams 128px height
   - Verify status tag (Active = green, Ended = gray)
   - Verify control buttons color changes
   - Verify resizer drag functionality
2. **Mobile View** (<768px):
   - Verify left sidebar hidden
   - Verify panels stack vertically (50/50 height)
   - Verify no resizer visible

### Video/Audio Controls Testing
1. **Camera Toggle**: Click, verify background color change (gray ↔ red)
2. **Mic Toggle**: Click, verify background color change (gray ↔ red)
3. **Icon Changes**: Verify Camera/CameraOff, Mic/MicOff icons swap
4. **Hover States**: Hover, verify darker shades
5. **Focus States**: Tab navigate, verify blue focus ring with 2px offset

### Panel Resizer Testing
1. **Drag Handle Hover**: Verify color change to blue (#0f62fe)
2. **Cursor Changes**: Verify col-resize cursor on hover and drag
3. **Width Constraints**: Drag to extremes, verify 30%-70% clamping
4. **Smooth Dragging**: Verify no text selection during drag
5. **Release**: Verify cursor returns to default

### TabView Testing
1. **Tab Click**: Verify background color change (inactive gray → active darker gray)
2. **Tab Hover**: Verify hover state on inactive tabs
3. **Content Switch**: Verify Chat/Log content switches correctly

### Chat Testing
1. **Message Display**: Verify proper spacing, borders, colors
2. **Own Messages**: Verify background highlight (#262626)
3. **Timestamp**: Verify relative time format ("2 minutes ago")
4. **Loading State**: Verify spinner and text centered
5. **Error State**: Verify error message in red, retry hint
6. **Input Field**: 
   - Verify 32px height
   - Verify border color change on hover
   - Verify placeholder text visibility
7. **Long Messages**: Verify word wrapping works correctly

### Code Editor Header Testing
1. **Language Selector**:
   - Verify custom arrow icon visible
   - Verify hover background change
   - Verify focus ring appearance
   - Verify dropdown options readable
2. **Title**: Verify "Code Editor" text visible and styled correctly

---

## Color Reference

| Element | Color Code | Usage |
|---------|-----------|-------|
| Primary Background | `#161616` | Main content areas, video containers |
| Secondary Background | `#262626` | Sidebar, modals, elevated surfaces |
| Border Color | `#393939` | All borders, separators |
| Light Border | `#525252` | Hover states, focus states |
| Primary Text | `#f4f4f4` | Headings, labels, important text |
| Secondary Text | `#e0e0e0` | Body text, chat messages |
| Tertiary Text | `#c6c6c6` | Labels, hints |
| Muted Text | `#8d8d8d` | Placeholders, disabled text, timestamps |
| Placeholder Text | `#6f6f6f` | Input placeholders |
| Primary Action | `#0f62fe` | Focus rings, resizer hover, progress bars |
| Success | `#42be65` | Success toast border/icon |
| Success Dark | `#198038` | Active status tag |
| Error | `#fa4d56` | Error toast border/icon, focus ring (End button) |
| Danger | `#da1e28` | End button, camera/mic off buttons |
| Danger Dark | `#bc1a23` | Hover states for danger buttons |
| Warning | `#f1c21b` | Warning toast border/icon |
| Info | `#0f62fe` | Info toast border/icon (same as primary action) |
| Control Active | `#393939` | Camera/mic on button background |
| Control Active Hover | `#4d4d4d` | Camera/mic on button hover |
| Tab Active | `#393939` | Active tab background |
| Tab Hover | `#353535` | Inactive tab hover, select hover |

---

## Spacing System

| Size | Tailwind Class | Pixels | Usage |
|------|---------------|--------|-------|
| 0.5 | `h-0.5`, `py-0.5` | 2px | Progress bar height, status tag vertical padding |
| 1 | `mb-1`, `gap-1` | 4px | Small margins |
| 2 | `py-2`, `px-2`, `gap-2`, `space-y-2` | 8px | Control padding, small gaps |
| 2.5 | `p-2.5` | 10px | Button padding (camera/mic controls) |
| 3 | `px-3`, `py-3`, `space-x-3`, `gap-3` | 12px | Input padding, control spacing, toast gap |
| 4 | `p-4`, `px-4`, `py-4`, `gap-4`, `space-y-4` | 16px | Section padding, toast icon gap, video section spacing |
| 6 | `p-6` | 24px | Toast container padding |
| 8 | `h-8` | 32px | Input field height, button height |
| 32 | `h-32`, `h-[32px]` | 128px / 32px | Video stream height / End button height |
| 80 | `w-80` | 320px | Left sidebar width |

---

## Typography Scale

| Element | Font Size | Weight | Tailwind Classes |
|---------|-----------|--------|------------------|
| Room Title | 14px | 500 | `text-sm font-medium` |
| Status Tag | 12px | 500 | `text-xs font-medium` |
| Video Label | 12px | 500 | `text-xs font-medium` |
| Toast Message | 14px | 400 | `text-sm` |
| Chat Username | 12px | 500 | `text-xs font-medium` |
| Chat Timestamp | 11px | 400 | `text-[11px]` |
| Chat Message | 14px | 400 | `text-sm` |
| Tab Button | 14px | 500 | `text-sm font-medium` |
| End Button | 12px | 500 | `text-xs font-medium` |
| Code Editor Title | 14px | 500 | `text-sm font-medium` |
| Language Selector | 14px | 400 | `text-sm` |
| Loading Text | 14px | 400 | `text-sm` |
| Error Text | 14px | 400 | `text-sm` |
| Error Hint | 12px | 400 | `text-xs` |

---

## Animation Details

### slideIn (Toast)
```css
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
```
- **Duration**: 200ms
- **Easing**: ease-out
- **Class**: `animate-slideIn`

### shrink (Toast Progress Bar)
```css
@keyframes shrink {
  from { width: 100%; }
  to { width: 0%; }
}
```
- **Duration**: Matches toast duration (2000ms-4000ms)
- **Easing**: linear
- **Class**: `animate-shrink`

### spin (Loading Spinner)
- **Tailwind Built-in**: `animate-spin`
- **Duration**: 1000ms
- **Easing**: linear
- **Rotation**: 0deg → 360deg

---

## Responsive Breakpoints

| Breakpoint | Min Width | Prefix | Usage |
|------------|-----------|--------|-------|
| Mobile | 0px | (none) | Default styles |
| Tablet/Desktop | 768px | `md:` | Sidebar visible, horizontal layout, resizer active |

**Key Responsive Changes**:
1. **Sidebar**: Hidden on mobile, visible on md+
2. **Main Content**: Vertical stack on mobile, horizontal on md+
3. **Panels**: 50/50 height split on mobile, resizable width on md+
4. **Resizer**: Hidden on mobile, active on md+

---

## Custom Scrollbar (`.custom-scrollbar`)

**File**: `client-cp/src/app.css`

```css
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #4d4d4d #262626;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #262626;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4d4d4d;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #6f6f6f;
}
```

**Specifications**:
- **Width**: 8px
- **Track**: #262626 (secondary background)
- **Thumb**: #4d4d4d (light gray)
- **Thumb Hover**: #6f6f6f (lighter gray)
- **Thumb Corners**: 4px border radius

---

## Focus States Summary

All interactive elements follow consistent focus ring patterns:

### Standard Focus Ring
```tsx
className="focus:outline-none focus:ring-2 focus:ring-[#0f62fe]"
```
- **Ring Width**: 2px
- **Ring Color**: #0f62fe (IBM Carbon primary blue)

### Focus Ring with Offset
```tsx
className="focus:outline-none focus:ring-2 focus:ring-[#0f62fe] 
          focus:ring-offset-2 focus:ring-offset-[#262626]"
```
- **Ring Width**: 2px
- **Ring Color**: #0f62fe
- **Offset**: 2px gap
- **Offset Color**: #262626 (matches sidebar background)

### Danger Button Focus Ring
```tsx
className="focus:outline-none focus:ring-2 focus:ring-[#fa4d56] 
          focus:ring-offset-2 focus:ring-offset-[#262626]"
```
- **Ring Color**: #fa4d56 (lighter red for visibility)

---

## VideoStream Component

**File Location**: `client-cp/src/components/rooms/VideoStream.tsx`

### Component Props
```typescript
interface VideoStreamProps {
  stream: MediaStream | null;
  muted?: boolean;
  title?: string;
  className?: string;
}
```

### Default Styling
```tsx
className="w-48 h-32 bg-neutral-800"
```
- **Width**: `w-48` = 192px
- **Height**: `h-32` = 128px
- **Background**: `bg-neutral-800` = Fallback background (Tailwind neutral-800)

**Note**: When used in `$roomId.tsx`, these default classes are overridden by the parent-provided `className` prop:
```tsx
<VideoStream
  stream={localStream}
  className="rounded-sm border border-[#393939] w-full h-32 shadow-lg bg-[#161616]"
/>
```
- **Width**: `w-full` = 100% (overrides w-48)
- **Height**: `h-32` = 128px (same)
- **Background**: `bg-[#161616]` (overrides bg-neutral-800)
- Additional: rounded corners, border, shadow

### Video Element Attributes
```tsx
<video
  ref={videoElement}
  muted={muted}
  autoPlay
  playsInline
  title={title}
/>
```
- **muted**: Controlled by prop (true for local stream)
- **autoPlay**: Automatically play when stream loads
- **playsInline**: Prevent fullscreen on mobile iOS
- **title**: Accessibility label

---

## Conclusion

This blueprint provides every CSS class, color code, dimension, and animation detail needed to rebuild the CodePair Interview Session Interface pixel-perfectly. All measurements are exact as implemented in the source code, with no approximations or simplifications.

**Part 2 Coverage**:
- ✅ Toast Notification System (4 variants, animations, positioning)
- ✅ Interview Session Layout (sidebar, video containers, status tags)
- ✅ Video/Audio Controls (button states, icon swapping, focus rings)
- ✅ Panel Resizer System (drag logic, width constraints, cursor changes)
- ✅ TabView Component (active/inactive states, transitions)
- ✅ Chat Component (messages, input, loading/error states)
- ✅ Code Editor Header (language selector, custom dropdown arrow)

**Next**: Part 3 will cover Code Editor (Monaco integration), WriteSpace (TipTap notes editor), and remaining UI components.
