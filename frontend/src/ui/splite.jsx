import React from "react";
// 'use client'

import { Suspense, lazy, useEffect, useState } from 'react'

// Dynamically import Spline with error handling
const Spline = lazy(() => 
  import('@splinetool/react-spline').catch(err => {
    console.error('Failed to load Spline:', err);
    return { default: () => <div className="w-full h-full flex items-center justify-center text-white">3D Scene Unavailable</div> };
  })
);

export function SplineScene({ scene, className }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        <p>Unable to load 3D scene</p>
      </div>
    );
  }

  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white text-sm">Loading 3D Scene...</p>
          </div>
        </div>
      }
    >
      <div className={`w-full h-full ${className || ''}`}>
        <Spline 
          scene={scene}
          onLoad={() => {
            console.log('Spline loaded');
            setIsLoading(false);
          }}
          onError={(err) => {
            console.error('Spline error:', err);
            setHasError(true);
          }}
        />
      </div>
    </Suspense>
  )
}