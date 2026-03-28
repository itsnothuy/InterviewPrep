"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * P0.6: Error Boundary to catch runtime errors in the room page
 * Provides graceful error handling and recovery UI
 */
class RoomErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error to console for debugging
    console.error("Room Error Boundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Reload the page to recover
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              {this.state.error?.message || "An unexpected error occurred in the room."}
            </p>
            <div className="space-y-2">
              <Button
                onClick={this.handleReset}
                className="w-full"
                variant="default"
              >
                Reload Page
              </Button>
              <Button
                onClick={() => (window.location.href = "/human")}
                className="w-full"
                variant="outline"
              >
                Back to Rooms
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RoomErrorBoundary;
