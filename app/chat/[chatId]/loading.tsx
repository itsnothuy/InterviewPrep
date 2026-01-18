// BP-005 FIX: Add loading state for Suspense boundary
// Note: Server components can't use useTranslations hook directly
// Using static English text for skeleton loading state
export default function ChatLoading() {
  return (
    <div className="flex w-full h-screen bg-bg pt-10 mt-8">
      <div className="flex w-full h-full">
        {/* Sidebar skeleton */}
        <div className="flex-[1] max-w-xs h-full bg-neutral-900 p-4">
          <div className="space-y-4">
            {/* New Chat button skeleton */}
            <div className="h-10 bg-gray-700 animate-pulse rounded" />
            {/* Chat list skeletons */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-800 animate-pulse rounded" />
            ))}
          </div>
        </div>
        
        {/* PDF viewer skeleton */}
        <div className="h-full flex-[6] bg-gray-800 flex items-center justify-center">
          <div className="text-gray-400 animate-pulse" aria-label="Loading PDF">
            <svg className="animate-spin h-8 w-8 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
        
        {/* Chat component skeleton */}
        <div className="flex-[3] bg-[#40414F] flex flex-col">
          {/* Header skeleton */}
          <div className="p-2 bg-[#2D2F36] h-fit mb-2">
            <div className="h-6 w-20 bg-gray-600 animate-pulse rounded" />
          </div>
          
          {/* Messages skeleton */}
          <div className="flex-grow p-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div className={`h-16 ${i % 2 === 0 ? 'w-3/4' : 'w-2/3'} bg-gray-600 animate-pulse rounded-lg`} />
              </div>
            ))}
          </div>
          
          {/* Input skeleton */}
          <div className="p-2 bg-[#2D2F36]">
            <div className="h-10 bg-gray-600 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
