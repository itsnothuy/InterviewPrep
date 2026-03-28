// BP-004 FIX: Add error boundary for graceful error handling
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors');
  
  useEffect(() => {
    // Log error to error reporting service (e.g., Sentry)
    console.error('Chat page error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-bg">
      <div className="max-w-md p-8 bg-neutral-900 rounded-lg shadow-lg text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h2 className="text-xl font-bold text-white mb-2">
          {t('somethingWentWrong')}
        </h2>
        
        <p className="text-gray-400 mb-6">
          {error.message || 'An unexpected error occurred while loading the chat.'}
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button
            onClick={reset}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {t('tryAgain')}
          </Button>
          
          <Button
            onClick={() => window.location.href = '/resume-ai'}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            {t('goToChats')}
          </Button>
        </div>
        
        {error.digest && (
          <p className="mt-4 text-xs text-gray-500">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
