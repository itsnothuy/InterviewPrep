'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseResizableOptions {
  initialWidth: number;
  minWidth: number;
  maxWidth: number;
  storageKey?: string;
}

/**
 * Custom hook for resizable panels
 * Based on lessons learned from POSTMORTEM_CODE_EDITOR_REFACTOR.md
 * 
 * KEY PATTERN (from commit 69c984c):
 * - Add event listeners IMMEDIATELY in handleMouseDown
 * - Remove event listeners IMMEDIATELY in handleMouseUp  
 * - Use useEffect ONLY for cleanup on unmount
 * - Never rely on useEffect dependencies to add listeners
 */
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
      if (saved) {
        const parsedWidth = parseInt(saved, 10);
        // Validate saved width is within bounds
        if (parsedWidth >= minWidth && parsedWidth <= maxWidth) {
          return parsedWidth;
        }
      }
    }
    return initialWidth;
  });

  const [isResizing, setIsResizing] = useState(false);
  const isDragging = useRef(false);

  // Mouse move handler - must be useCallback for proper cleanup
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX;
    // Clamp width between min and max
    const clampedWidth = Math.min(Math.max(deltaX, minWidth), maxWidth);
    setWidth(clampedWidth);
  }, [minWidth, maxWidth]);

  // Mouse up handler - must be useCallback for proper cleanup
  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;

    isDragging.current = false;
    setIsResizing(false);
    document.body.style.cursor = 'default';
    document.body.style.userSelect = '';

    // Remove listeners IMMEDIATELY (not in useEffect)
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    // Save to localStorage after resize completes
    if (storageKey) {
      localStorage.setItem(storageKey, width.toString());
    }
  }, [handleMouseMove, storageKey, width]);

  // Mouse down handler - starts the resize
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    // Add listeners IMMEDIATELY (not in useEffect)
    // This is the critical fix from POSTMORTEM commit 69c984c
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // useEffect ONLY for cleanup on unmount (safety net)
  // Not for adding listeners on state changes
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = '';
    };
  }, [handleMouseMove, handleMouseUp]);

  return { width, isResizing, handleMouseDown };
}
