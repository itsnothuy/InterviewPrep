# P1 Testing Guide - ARIA + PDF Modal Refactor

## Overview
This document outlines how to test P1.1 (ARIA labels) and P1.3 (PDF modal refactor) implemented in the InterviewPrep codebase.

---

## P1.1: ARIA Labels for Accessibility ✅

### What Changed
- **Files:** `components/human/RoomCards.tsx`
- **Changes:**
  1. PDF preview button: Added `aria-label={`View resume for ${room.name}`}`
  2. Modal close button: Added `aria-label="Close resume preview"`
- **Why:** Screen readers need labels for icon-only buttons

### Testing Steps

#### Test 1: Screen Reader - PDF Button
**Requirement:** Screen reader announces button purpose

**Steps:**
1. Install screen reader:
   - **Mac:** VoiceOver (Cmd+F5 to enable)
   - **Windows:** NVDA (free at nvaccess.org)
   - **Linux:** Orca
2. Navigate to `/human` page
3. Tab through the interface until you reach a room card's PDF icon
4. Screen reader should announce: **"View resume for [Room Name]"**

**Expected:** Clear, descriptive label
**Failure:** "Button" or "Unlabeled button" or silence

#### Test 2: Screen Reader - Close Button
**Requirement:** Modal close button is accessible

**Steps:**
1. Click PDF icon to open resume preview
2. With screen reader active, Tab to the close button
3. Screen reader should announce: **"Close resume preview"**
4. Press Enter/Space to close modal

**Expected:** Button closes modal and focus returns to page
**Failure:** Button not reachable via keyboard, or no label announced

#### Test 3: Keyboard Navigation
**Requirement:** All interactive elements reachable via keyboard

**Steps:**
1. Navigate to `/human` page
2. Press Tab repeatedly to cycle through interactive elements
3. Verify you can reach:
   - Search input
   - Search button
   - Clear button (if search active)
   - Create Room button
   - Each room's "Join Room" button
   - Each room's PDF preview button (if resume exists)
4. Press Enter on PDF button
5. Modal should open
6. Tab should move focus to Close button
7. Press Enter to close

**Expected:** Complete keyboard accessibility, no mouse required
**Failure:** Elements not reachable, focus trapped, or Tab order broken

#### Test 4: Automated Accessibility Scan
**Requirement:** No ARIA-related issues detected

**Tools:**
- [axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd) (Recommended)
- [WAVE](https://wave.webaim.org/extension/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) (built into Chrome DevTools)

**Steps:**
1. Navigate to `/human` page
2. Open Chrome DevTools (F12)
3. Go to Lighthouse tab
4. Select "Accessibility" category
5. Click "Generate report"
6. Check score (should be 90+)
7. Review any issues related to buttons/labels

**Expected:** Improved accessibility score compared to before P1.1
**Failure:** Issues flagged for unlabeled buttons

---

## P1.3: PDF Modal Refactor (Memory Optimization) ✅

### What Changed
- **Files:** 
  - NEW: `app/human/HumanRoomContent.tsx` (client wrapper component)
  - MODIFIED: `app/human/page.tsx` (now uses wrapper)
  - MODIFIED: `components/human/RoomCards.tsx` (removed modal, added callback)
- **Architecture Change:**
  ```
  BEFORE:
  page.tsx → N × RoomCard (each with hidden modal)
  Result: 50 cards = 50 modals in DOM = memory waste
  
  AFTER:
  page.tsx → HumanRoomContent → N × RoomCard + 1 modal
  Result: 50 cards = 1 modal = efficient memory usage
  ```

### Testing Steps

#### Test 1: Basic Functionality (No Regression)
**Requirement:** PDF preview still works exactly as before

**Steps:**
1. Navigate to `/human` page
2. Find a room card with a resume (PDF icon visible)
3. Click the PDF icon
4. Modal should open with PDF preview
5. Click "Close" button
6. Modal should close

**Expected:** Identical behavior to before refactor
**Failure:** Modal doesn't open, PDF doesn't load, close button broken

#### Test 2: Multiple Rooms Test
**Requirement:** Clicking different PDF buttons shows correct resume

**Steps:**
1. Ensure database has at least 3 rooms with different resumes
2. Navigate to `/human` page
3. Click PDF icon on Room A → Verify correct resume shows
4. Close modal
5. Click PDF icon on Room B → Verify Room B's resume shows (not Room A's)
6. Close modal
7. Click PDF icon on Room C → Verify Room C's resume shows
8. Close modal

**Expected:** Each room shows its own unique resume
**Failure:** Wrong resume displays, or same resume for all rooms

#### Test 3: Memory Usage Comparison
**Requirement:** Reduced memory footprint with many cards

**Tools:** Chrome DevTools Memory Profiler

**Setup:**
1. Create 50+ test rooms in database (or use production data)

**Steps:**
1. Open Chrome DevTools (F12)
2. Go to "Memory" tab
3. Take heap snapshot **BEFORE** navigating to `/human`
4. Navigate to `/human` page (should show 50+ cards)
5. Take heap snapshot **AFTER** page loads
6. Compare "Detached DOM Tree" count
7. Click through several PDF previews
8. Take another snapshot
9. Check for memory leaks (detached nodes should not grow)

**Expected:** 
- Fewer DOM nodes in memory
- No memory leaks when opening/closing modals
- Stable memory usage after multiple interactions

**Failure:**
- Memory grows indefinitely
- Detached DOM nodes accumulate
- Browser slows down with many cards

#### Test 4: DOM Inspection
**Requirement:** Only ONE modal element exists in DOM

**Steps:**
1. Navigate to `/human` page with multiple rooms
2. Open Chrome DevTools (F12)
3. Go to "Elements" tab
4. Press Ctrl+F (Cmd+F on Mac) to search DOM
5. Search for: `fixed inset-0 bg-black` (modal container class)
6. Count results

**Expected:** 
- **BEFORE refactor:** N results (one per card)
- **AFTER refactor:** 0 results when modal closed, 1 result when modal open

**Steps to verify:**
1. With modal closed, search should find 0 matches
2. Click any PDF button to open modal
3. Search should find EXACTLY 1 match
4. Close modal, search again → 0 matches

**Failure:** Multiple modal elements exist simultaneously

#### Test 5: Keyboard Accessibility (Post-Refactor)
**Requirement:** Keyboard nav still works after architectural change

**Steps:**
1. Navigate to `/human` page
2. Use Tab key to reach first PDF button
3. Press Enter to open modal
4. Press Tab → Focus should move to Close button
5. Press Enter to close
6. Focus should return to page (ideally to the button that opened it)
7. Continue tabbing to next PDF button
8. Repeat process

**Expected:** Seamless keyboard navigation
**Failure:** Focus lost, Tab doesn't reach close button, focus doesn't return

#### Test 6: Escape Key to Close (Bonus)
**Note:** This was NOT implemented in P1.3, but good to test for future

**Steps:**
1. Click PDF button to open modal
2. Press Escape key
3. Check if modal closes

**Expected:** Modal should close (would need implementation)
**Current State:** Escape key likely does NOT close modal (not implemented yet)

#### Test 7: Empty State (No Rooms with Resumes)
**Requirement:** Page works when no rooms have resumes

**Steps:**
1. Create test rooms with `pdfUrl = null`
2. Navigate to `/human` page
3. Verify no PDF icons appear
4. Verify no errors in console

**Expected:** Cards display normally, no PDF buttons, no errors
**Failure:** Console errors, broken layout, crash

#### Test 8: Search + Modal Interaction
**Requirement:** Modal works correctly after filtering

**Steps:**
1. Navigate to `/human` page with 20+ rooms
2. Use search to filter to 5 rooms
3. Click PDF icon on filtered room
4. Modal should open with correct resume
5. Close modal
6. Clear search filter
7. Click PDF icon on different room
8. Verify correct resume shows

**Expected:** Modal works regardless of filtering state
**Failure:** Wrong resume shows, or modal breaks after search

---

## Regression Testing Checklist

Ensure these existing features STILL work after P1 changes:

### Core Functionality
- [ ] **Room Creation** - Can create new rooms via `/human/create-room`
- [ ] **Room Joining** - "Join Room" button navigates to `/human-rooms/[id]`
- [ ] **GitHub Link** - Valid GitHub URLs render as clickable links
- [ ] **XSS Protection** - Invalid URLs (from P0.3) still blocked
- [ ] **Search** - Filtering by language still works
- [ ] **Clear Search** - Clear button resets filter
- [ ] **Empty State** - "No rooms" message shows when appropriate

### Visual/UX
- [ ] **Responsive Grid** - P0.1 responsive layout still works
- [ ] **Mobile View** - All features work on mobile devices
- [ ] **Card Layout** - Room cards display correctly
- [ ] **Language Badges** - Programming language pills render
- [ ] **Truncation** - Long names/descriptions truncate properly

### Performance
- [ ] **Page Load Speed** - No noticeable slowdown
- [ ] **Modal Open Speed** - PDF preview opens quickly
- [ ] **Smooth Animations** - No jank when opening/closing modal
- [ ] **Console** - No errors or warnings in browser console

---

## Test Data Setup

### Minimal Test Setup
```sql
-- Create 3 test rooms with resumes
INSERT INTO room (name, description, language, github_repo, pdf_url) VALUES
  ('Frontend Role', 'React developer position', 'JavaScript,TypeScript', 'https://github.com/test/frontend', 'https://example.com/resume1.pdf'),
  ('Backend Role', 'Node.js engineer needed', 'JavaScript,Python', 'https://github.com/test/backend', 'https://example.com/resume2.pdf'),
  ('Fullstack Role', 'Full-stack developer', 'JavaScript,Python,Go', 'https://github.com/test/fullstack', 'https://example.com/resume3.pdf');
```

### Stress Test Setup
```sql
-- Create 50 rooms for performance testing
-- Run this in a loop or use a script
```

### Edge Cases
```sql
-- Room with no resume (should not show PDF button)
INSERT INTO room (name, description, language, pdf_url) VALUES
  ('No Resume Role', 'This room has no resume', 'JavaScript', NULL);

-- Room with invalid GitHub URL (should not show link)
INSERT INTO room (name, description, language, github_repo, pdf_url) VALUES
  ('Invalid GitHub', 'Bad GitHub URL', 'Python', 'javascript:alert(1)', 'https://example.com/resume.pdf');

-- Room with very long name/description (test truncation)
INSERT INTO room (name, description, language, pdf_url) VALUES
  ('This is an extremely long room name that should be truncated properly', 
   'This is an extremely long description that should also be truncated',
   'JavaScript', 
   'https://example.com/resume.pdf');
```

---

## Automated Testing (Future)

### Unit Tests (Recommended)
```typescript
// Example test for RoomCard callback
describe('RoomCard', () => {
  it('calls onViewResume when PDF button clicked', () => {
    const mockCallback = jest.fn();
    const room = { id: '1', name: 'Test', pdfUrl: 'http://test.pdf', /* ... */ };
    
    render(<RoomCard room={room} onViewResume={mockCallback} />);
    
    const pdfButton = screen.getByLabelText(/View resume for Test/i);
    fireEvent.click(pdfButton);
    
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('does not render PDF button when no pdfUrl', () => {
    const room = { id: '1', name: 'Test', pdfUrl: null, /* ... */ };
    
    render(<RoomCard room={room} />);
    
    const pdfButton = screen.queryByLabelText(/View resume/i);
    expect(pdfButton).not.toBeInTheDocument();
  });
});
```

### Integration Tests
```typescript
// Test modal opening/closing flow
describe('Human Room Page', () => {
  it('opens modal when PDF button clicked', async () => {
    const rooms = [
      { id: '1', name: 'Room A', pdfUrl: 'http://a.pdf', /* ... */ }
    ];
    
    render(<HumanRoomContent rooms={rooms} />);
    
    const pdfButton = screen.getByLabelText(/View resume for Room A/i);
    fireEvent.click(pdfButton);
    
    const modal = await screen.findByLabelText(/Close resume preview/i);
    expect(modal).toBeInTheDocument();
  });

  it('closes modal when close button clicked', async () => {
    // ... test implementation
  });
});
```

---

## Success Criteria

P1.1 + P1.3 is considered successful if:

### Functionality
- ✅ PDF preview works identically to before refactor
- ✅ Correct resume shows for each room
- ✅ Modal opens and closes properly
- ✅ Keyboard navigation fully functional

### Accessibility
- ✅ Screen readers announce button labels correctly
- ✅ All interactive elements reachable via keyboard
- ✅ Accessibility score improves (Lighthouse)
- ✅ No new ARIA violations

### Performance
- ✅ Memory usage reduced with many cards
- ✅ No memory leaks detected
- ✅ Only one modal in DOM (not N modals)
- ✅ Page load time not degraded

### Code Quality
- ✅ TypeScript build succeeds with no errors
- ✅ No console errors or warnings
- ✅ Clean component architecture (server + client split)
- ✅ Props properly typed

### No Regressions
- ✅ All P0 fixes still work (responsive, URL validation, empty state)
- ✅ Search functionality intact
- ✅ Room creation/joining works
- ✅ Visual layout unchanged

---

## Rollback Plan

If P1.1 + P1.3 causes issues:

### Quick Rollback (Git)
```bash
# Revert entire P1 commit
git revert <p1-commit-hash>
git push

# Or reset to before P1
git reset --hard <commit-before-p1>
git push --force
```

### Partial Rollback

**If only P1.3 (modal refactor) is broken:**
1. Revert `HumanRoomContent.tsx` (delete file)
2. Restore old `page.tsx` (remove wrapper, add back grid logic)
3. Restore old `RoomCards.tsx` (add back modal, remove callback)
4. Keep P1.1 ARIA labels (they're harmless)

**If only P1.1 (ARIA labels) is broken:**
- Highly unlikely, but just remove `aria-label` attributes

---

## Known Limitations (Being Honest)

### What P1 Did NOT Fix:
- ❌ Escape key doesn't close modal (would need onKeyDown handler)
- ❌ No focus trap in modal (Tab can escape modal bounds)
- ❌ No loading state while PDF loads
- ❌ PDF viewer doesn't handle errors gracefully (bad URL)
- ❌ No animation when modal opens/closes
- ❌ PDF button has no loading/disabled state

### Future Improvements (P2 or Later):
- Add Escape key handler to close modal
- Implement focus trap for modal
- Add loading spinner while PDF loads
- Handle PDF load errors with fallback UI
- Animate modal entrance/exit
- Disable PDF button while modal is open

---

## Documentation Updates Needed

After successful P1 testing:
- [ ] Update component documentation for `RoomCard` props
- [ ] Document new `HumanRoomContent` wrapper pattern
- [ ] Add architecture diagram showing server/client split
- [ ] Update accessibility compliance documentation
- [ ] Add memory optimization notes for future devs

---

## Next Steps After P1

Once all P1 tests pass:
1. ✅ Verify all manual tests above
2. ✅ Commit changes
3. ✅ Update project documentation
4. 🔜 Proceed to **P1.2 (Pagination)** in next prompt - This is COMPLEX!

---

**End of P1 Testing Guide**
