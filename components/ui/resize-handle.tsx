'use client';

import { cn } from '@/lib/utils';

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  isResizing: boolean;
}

/**
 * Resize handle component - visual separator between panels
 * Shows hover state and dragging state for user feedback
 */
export function ResizeHandle({ onMouseDown, isResizing }: ResizeHandleProps) {
  return (
    <div
      className={cn(
        "relative w-1 bg-transparent hover:bg-blue-500/30 transition-colors cursor-col-resize flex-shrink-0 group",
        isResizing && "bg-blue-500/50"
      )}
      onMouseDown={onMouseDown}
      title="Drag to resize"
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize panel"
    >
      {/* Visual indicator on hover - blue pill */}
      <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="w-0.5 h-12 bg-blue-500 rounded-full" />
      </div>
    </div>
  );
}
