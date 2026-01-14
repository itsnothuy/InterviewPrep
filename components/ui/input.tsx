import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Standard Input component with consistent focus ring
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-carbon-border-medium bg-carbon-bg-primary px-4 py-2 text-sm text-carbon-text-primary transition-colors duration-150 ease-in-out",
          "placeholder:text-carbon-text-quaternary",
          "hover:border-carbon-border-strong",
          "focus-visible:outline-none focus-visible:border-violet focus-visible:ring-1 focus-visible:ring-violet",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

/**
 * Floating Label Input - IBM Carbon Design pattern
 * Label floats above the input field
 */
export interface FloatingLabelInputProps extends InputProps {
  label: string;
  error?: string;
  containerClassName?: string;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ className, label, error, containerClassName, id, ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
    
    return (
      <div className={cn("relative", containerClassName)}>
        <input
          id={inputId}
          className={cn(
            "peer flex h-10 w-full rounded-none border border-carbon-border-medium bg-carbon-bg-primary px-4 py-2 text-sm text-carbon-text-primary transition-colors duration-150 ease-in-out",
            "placeholder:text-carbon-text-quaternary",
            "hover:border-carbon-border-strong",
            "focus-visible:outline-none focus-visible:border-violet focus-visible:ring-1 focus-visible:ring-violet",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-carbon-red-error focus-visible:border-carbon-red-error focus-visible:ring-carbon-red-error",
            className
          )}
          ref={ref}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "absolute -top-2 left-2 bg-carbon-bg-secondary px-1 text-xs text-carbon-text-secondary transition-all duration-150",
            error && "text-carbon-red-error"
          )}
        >
          {label}
        </label>
        {error && (
          <p className="mt-1 text-xs text-carbon-red-error">{error}</p>
        )}
      </div>
    )
  }
)
FloatingLabelInput.displayName = "FloatingLabelInput"

/**
 * Number Input with custom spinner controls - IBM Carbon pattern
 */
export interface NumberInputProps extends Omit<InputProps, 'type' | 'onChange'> {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  containerClassName?: string;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, label, value, onChange, min, max, step = 1, containerClassName, id, ...props }, ref) => {
    const inputId = id || `number-input-${label?.toLowerCase().replace(/\s+/g, '-') || 'default'}`;
    
    const handleIncrement = () => {
      const newValue = value + step;
      if (max === undefined || newValue <= max) {
        onChange(newValue);
      }
    };
    
    const handleDecrement = () => {
      const newValue = value - step;
      if (min === undefined || newValue >= min) {
        onChange(newValue);
      }
    };
    
    return (
      <div className={cn("relative", containerClassName)}>
        <input
          id={inputId}
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            "peer flex h-10 w-full rounded-none border border-carbon-border-medium bg-carbon-bg-primary pl-4 pr-10 py-2 text-sm text-carbon-text-primary transition-colors duration-150 ease-in-out",
            "hover:border-carbon-border-strong",
            "focus-visible:outline-none focus-visible:border-violet focus-visible:ring-1 focus-visible:ring-violet",
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Hide default browser spinners
            "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]",
            className
          )}
          ref={ref}
          min={min}
          max={max}
          step={step}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className="absolute -top-2 left-2 bg-carbon-bg-secondary px-1 text-xs text-carbon-text-secondary"
          >
            {label}
          </label>
        )}
        {/* Custom spinner buttons */}
        <div className="absolute right-0 top-0 h-full flex flex-col border-l border-carbon-border-medium divide-y divide-carbon-border-medium">
          <button
            type="button"
            onClick={handleIncrement}
            className="flex items-center justify-center w-10 h-5 text-carbon-text-tertiary hover:text-carbon-text-primary hover:bg-carbon-bg-tertiary transition-colors"
            tabIndex={-1}
            aria-label="Increment"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleDecrement}
            className="flex items-center justify-center w-10 h-5 text-carbon-text-tertiary hover:text-carbon-text-primary hover:bg-carbon-bg-tertiary transition-colors"
            tabIndex={-1}
            aria-label="Decrement"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    )
  }
)
NumberInput.displayName = "NumberInput"

export { Input, FloatingLabelInput, NumberInput }
