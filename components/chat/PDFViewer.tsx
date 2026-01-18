"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

type Props = { pdf_url: string };

const PDFViewer = ({ pdf_url }: Props) => {
  const t = useTranslations('pdfViewer');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // SEC-003 FIX: Validate URL is from expected S3 bucket
  const isValidUrl = pdf_url.startsWith(`https://`) && 
                     (pdf_url.includes('.s3.') || pdf_url.includes('s3.amazonaws.com'));
  
  // PERF-001 FIX: Lazy load iframe using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only need to load once
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // Start loading 100px before visible
      }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  if (!isValidUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-800 text-red-500">
        <p>{t('invalid')}</p>
      </div>
    );
  }
  
  // SEC-003 FIX: URL encode to prevent XSS
  const encodedUrl = encodeURIComponent(pdf_url);
  
  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* PERF-001 FIX: Show loading state until visible */}
      {(!isVisible || loading) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
          <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mb-2" />
          <p className="text-gray-400 text-sm">
            {!isVisible ? t('preparing') : t('loading')}
          </p>
        </div>
      )}
      {error ? (
        <div className="flex flex-col items-center justify-center h-full bg-gray-800 text-white">
          <p className="mb-4">{t('failed')}</p>
          <a 
            href={pdf_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            {t('download')}
          </a>
        </div>
      ) : isVisible ? (
        <iframe
          src={`https://docs.google.com/gview?url=${encodedUrl}&embedded=true`}
          className="w-full h-full"
          title="PDF Document Viewer"
          sandbox="allow-scripts allow-same-origin"
          // PERF-001 FIX: Native lazy loading as additional optimization
          loading="lazy"
          onLoad={() => setLoading(false)}
          onError={() => { setError(true); setLoading(false); }}
        />
      ) : null}
    </div>
  );
};


export default PDFViewer;
