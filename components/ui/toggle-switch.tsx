"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Toggle Switch Component - IBM Carbon Design Pattern
 * 
 * A custom toggle switch with accessible markup and smooth animations.
 * Follows the CodePair Blueprint specifications.
 * 
 * @example
 * ```tsx
 * const [enabled, setEnabled] = useState(false);
 * <ToggleSwitch checked={enabled} onCheckedChange={setEnabled} label="Enable feature" />
 * ```
 */
export interface ToggleSwitchProps {
  /** Whether the toggle is checked */
  checked: boolean;
  /** Callback when the toggle state changes */
  onCheckedChange: (checked: boolean) => void;
  /** Label text for the toggle */
  label?: string;
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Additional className for the container */
  className?: string;
  /** ID for the input element */
  id?: string;
  /** Size variant */
  size?: 'sm' | 'default' | 'lg';
}

const ToggleSwitch = React.forwardRef<HTMLInputElement, ToggleSwitchProps>(
  ({ 
    checked, 
    onCheckedChange, 
    label, 
    disabled = false, 
    className, 
    id,
    size = 'default',
    ...props 
  }, ref) => {
    const generatedId = React.useId();
    const inputId = id || `toggle-${generatedId}`;
    
    // Size configurations
    const sizeConfig = {
      sm: {
        track: 'h-5 w-9',
        thumb: 'h-3 w-3',
        thumbTranslate: 'translate-x-4',
        thumbOffset: 'left-1',
      },
      default: {
        track: 'h-6 w-10',
        thumb: 'h-4 w-4',
        thumbTranslate: 'translate-x-4',
        thumbOffset: 'left-1',
      },
      lg: {
        track: 'h-7 w-12',
        thumb: 'h-5 w-5',
        thumbTranslate: 'translate-x-5',
        thumbOffset: 'left-1',
      },
    };
    
    const config = sizeConfig[size];
    
    return (
      <div className={cn("flex items-center", className)}>
        <div className="relative">
          {/* Hidden checkbox for accessibility */}
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            disabled={disabled}
            className="sr-only peer"
            aria-label={label}
            {...props}
          />
          
          {/* Toggle track/label */}
          <label
            htmlFor={inputId}
            className={cn(
              "relative inline-flex items-center cursor-pointer",
              "transition-colors duration-200 ease-in-out",
              "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {/* Track background */}
            <span
              className={cn(
                config.track,
                "rounded-full transition-colors duration-200 ease-in-out",
                checked ? "bg-primary" : "bg-muted",
                !disabled && !checked && "hover:bg-muted/80"
              )}
            />
            
            {/* Thumb/circle */}
            <span
              className={cn(
                "absolute inline-block transform rounded-full bg-white transition-transform duration-200 ease-in-out",
                config.thumb,
                config.thumbOffset,
                checked ? config.thumbTranslate : "translate-x-0"
              )}
            />
          </label>
        </div>
        
        {/* Label text */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "ml-3 text-sm font-medium cursor-pointer transition-colors duration-150",
              checked ? "text-carbon-text-primary" : "text-carbon-text-secondary",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
ToggleSwitch.displayName = "ToggleSwitch";

/**
 * Custom Checkbox - IBM Carbon Design Pattern
 * 
 * A styled checkbox with custom visual styling matching Carbon design.
 */
export interface CustomCheckboxProps {
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Callback when the checkbox state changes */
  onCheckedChange: (checked: boolean) => void;
  /** Label text */
  label?: string;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Additional className */
  className?: string;
  /** ID for the input */
  id?: string;
}

const CustomCheckbox = React.forwardRef<HTMLInputElement, CustomCheckboxProps>(
  ({ checked, onCheckedChange, label, disabled = false, className, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || `checkbox-${generatedId}`;
    
    return (
      <label 
        className={cn(
          "group inline-flex items-center space-x-3 cursor-pointer",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <div className="relative flex items-center">
          {/* Hidden checkbox */}
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          
          {/* Custom checkbox visual */}
          <div
            className={cn(
              "h-4 w-4 border transition-all duration-150 ease-in-out flex items-center justify-center",
              "group-hover:border-border/80",
              checked 
                ? "border-primary bg-primary" 
                : "border-border bg-card",
              "peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-1 peer-focus:ring-offset-background"
            )}
          >
            {/* Check icon */}
            {checked && (
              <svg 
                className="w-3.5 h-3.5 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        
        {/* Label */}
        {label && (
          <span className={cn(
            "text-sm transition-colors duration-150",
            checked ? "text-carbon-text-primary" : "text-carbon-text-secondary",
            "group-hover:text-white"
          )}>
            {label}
          </span>
        )}
      </label>
    );
  }
);
CustomCheckbox.displayName = "CustomCheckbox";

export { ToggleSwitch, CustomCheckbox };
