// src/components/demo/SplineSceneBasic.tsx
import React, { useEffect, useState } from "react";
import { SplineScene } from "./splite";

export function SplineSceneBasic() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Responsive styles based on screen size
  const getStyles = () => {
    if (isMobile) {
      return {
        container: {
          width: '100%',
          height: '100%',
          position: 'relative' as const,
          overflow: 'hidden' as const,
        },
        wrapper: {
          width: '100%',
          height: '100%',
          transform: 'scale(2.2) translateY(5%)',
          transformOrigin: 'center center' as const,
        }
      };
    }
    
    if (isTablet) {
      return {
        container: {
          width: '100%',
          height: '100%',
          position: 'relative' as const,
          overflow: 'hidden' as const,
        },
        wrapper: {
          width: '100%',
          height: '100%',
          transform: 'scale(1.8) translateY(8%) translateX(-3%)',
          transformOrigin: 'center center' as const,
        }
      };
    }
    
    // Desktop
    return {
      container: {
        width: '100%',
        height: '100%',
        position: 'relative' as const,
        overflow: 'hidden' as const,
      },
      wrapper: {
        width: '120%',
        height: '400%',
        transform: 'scale(1.8) translateY(15%) translateX(-10%)',
        transformOrigin: 'center center' as const,
      }
    };
  };

  const styles = getStyles();

  return (
    <div style={styles.container}>
      <div className="flex h-full w-full">
        {/* Left side - Empty (hidden on mobile) */}
        {!isMobile && <div className="flex-1 relative z-10"></div>}

        {/* Right side / Center - 3D Robot */}
        <div className={`flex-1 relative flex items-center justify-center ${isMobile ? 'w-full' : ''}`}>
          <div style={styles.wrapper}>
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SplineSceneBasic;