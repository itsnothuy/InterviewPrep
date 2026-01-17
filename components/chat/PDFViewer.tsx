"use client";
import React, { useState } from "react";

type Props = { pdf_url: string };

const PDFViewer = ({ pdf_url }: Props) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // SEC-003 FIX: Validate URL is from expected S3 bucket
  const isValidUrl = pdf_url.startsWith(`https://`) && 
                     (pdf_url.includes('.s3.') || pdf_url.includes('s3.amazonaws.com'));
  
  if (!isValidUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-800 text-red-500">
        <p>Invalid PDF URL - Security check failed</p>
      </div>
    );
  }
  
  // SEC-003 FIX: URL encode to prevent XSS
  const encodedUrl = encodeURIComponent(pdf_url);
  
  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full" />
        </div>
      )}
      {error ? (
        <div className="flex flex-col items-center justify-center h-full bg-gray-800 text-white">
          <p className="mb-4">Failed to load PDF</p>
          <a 
            href={pdf_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            Download PDF
          </a>
        </div>
      ) : (
        <iframe
          src={`https://docs.google.com/gview?url=${encodedUrl}&embedded=true`}
          className="w-full h-full"
          title="PDF Document Viewer"
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => setLoading(false)}
          onError={() => { setError(true); setLoading(false); }}
        />
      )}
    </div>
  );
};


export default PDFViewer;
