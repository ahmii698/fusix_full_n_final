import React, { useEffect, useRef } from 'react';

export function SimpleSpline() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Simple div as placeholder
    if (containerRef.current) {
      containerRef.current.innerHTML = `
        <div style="width:100%;height:100%;background:linear-gradient(135deg,#1a1a2e,#16213e);display:flex;align-items:center;justify-content:center;border-radius:12px;">
          <div style="text-align:center;">
            <div style="font-size:48px;margin-bottom:16px;">🎨</div>
            <h3 style="color:white;margin-bottom:8px;">Interactive 3D Space</h3>
            <p style="color:#aaa;">Premium 3D Experience Coming Soon</p>
          </div>
        </div>
      `;
    }
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[400px]"></div>;
}