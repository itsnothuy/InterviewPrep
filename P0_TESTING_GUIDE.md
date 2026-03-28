# P0 Critical Fixes - Testing Guide

**Last Updated:** January 15, 2026  
**Commit:** 03739e4  
**Branch:** feature/new-theme  
**Status:** ✅ Ready for Testing

---

## Quick Start

```bash
# Ensure you're on the correct branch
git checkout feature/new-theme
git pull origin feature/new-theme

# Start development server
npm run dev
```

Server runs at: `http://localhost:3000`

---

## ✅ Test 1: Room Ownership Verification (P0.1)

### Test 1A: Unauthenticated Access
```
Steps:
1. Sign out completely
2. Navigate to: /human-rooms/[any-room-id]

Expected: Redirect to /api/auth/signin
```

### Test 1B: Unauthorized Access
```
Steps:
1. Sign in as User A → Create room → Copy room URL
2. Sign out → Sign in as User B
3. Paste User A's room URL

Expected: "Access Denied" message
```

### Test 1C: Authorized Access
```
Steps:
1. Sign in and open your own room

Expected: Room loads normally (video + code editor + details)
```

---

## ✅ Test 2: Invalid Room ID (P0.5)

```
Steps:
1. Sign in
2. Navigate to: /human-rooms/invalid-id-123

Expected: "Invalid Room ID" error (no DB query in Network tab)
```

---

## ✅ Test 3: Code Execution Timeout (P0.2)

```
Steps:
1. Open any room → Select JavaScript
2. Enter infinite loop:
   while(true) { console.log("test"); }
3. Click "Run Code" → Wait

Expected: Timeout after 10 seconds with error message
```

---

## ✅ Test 4: Loading States (P0.4)

```
Steps:
1. Enter code: print("Hello")
2. Click "Run Code"
3. Observe immediately

Expected:
- Spinner appears in button
- Button disabled
- "Executing code, please wait..." in output
- All clears when done
```

---

## ✅ Test 5: ARIA Accessibility (P0.3)

```
Steps:
1. Enable VoiceOver (Cmd + F5 on macOS)
2. Run code
3. Listen for announcements

Expected: "Executing code..." and completion status announced
```

---

## ✅ Test 6: Error Boundary (P0.6)

```
Steps (requires temporary code change):
1. Edit components/human/HumanRoomContent.tsx
2. Add in HumanRoomContentInner:
   throw new Error("Test error");
3. Reload room page

Expected:
- Error boundary catches error
- Shows friendly error UI
- "Reload Page" and "Back to Rooms" buttons work
```

---

## Success Criteria

All tests pass when:
- ✅ Security: Ownership enforced, IDs validated
- ✅ UX: Loading states clear, timeouts work
- ✅ A11y: Screen readers announce changes
- ✅ Stability: Errors caught gracefully
- ✅ No regressions in existing features

---

## Quick Integration Test

Run this complete flow:
1. Sign out → Try room access → Redirected ✅
2. Sign in → Invalid room ID → Error ✅
3. Other user's room → Access denied ✅
4. Own room → Loads successfully ✅
5. Run code → Loading + success ✅
6. Infinite loop → Timeout works ✅

All should pass in 5 minutes.

---

*For detailed testing procedures, see HUMAN_ROOMS_ROOMID_P0_IMPLEMENTATION.md*
