import React from "react";
// 'use client'

import { SplineScene } from "./components/ui/splite";
 
export function SplineSceneBasic() {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="flex h-full w-full">
        {/* Left side - Empty */}
        <div className="flex-1 relative z-10"></div>

        {/* Right side - 3D Robot - Left Shift */}
        <div className="flex-1 relative flex items-center justify-center">
          <div style={{ 
            width: '120%', 
            height: '400%',
            transform: 'scale(1.8) translateY(15%) translateX(-10%)',
            transformOrigin: 'center center'
          }}>
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}