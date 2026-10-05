// src/components/common/ProcessBalls.tsx
import React, { useRef, useEffect, useState, RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

// Types
interface ProcessStep {
  id?: number;
  title: string;
  description?: string;
}

interface BallPosition {
  x: number;
  y: number;
  z: number;
}

interface MousePosition {
  x: number;
  y: number;
}

interface ProcessBallProps {
  startPos: [number, number, number];
  mousePos: React.MutableRefObject<MousePosition | null>;
  title: string;
  shouldMove: boolean;
  ballColor: string;
  glowColor: string;
  isMobile: boolean;
}

interface ProcessBallsProps {
  steps: ProcessStep[];
}

const ProcessBall: React.FC<ProcessBallProps> = ({ 
  startPos, 
  mousePos, 
  title, 
  shouldMove, 
  ballColor, 
  glowColor, 
  isMobile 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const pos = useRef<BallPosition>({ x: startPos[0], y: startPos[1], z: startPos[2] });
  const originalPos = useRef<BallPosition>({ x: startPos[0], y: startPos[1], z: startPos[2] });
  const vel = useRef<BallPosition>({ x: 0, y: 0, z: 0 });
  
  // ✅ Mobile par ball size - LOCAL WALE JESA (0.70)
  const size = isMobile ? 0.70 : 1.15;
  
  useFrame(() => {
    if (!groupRef.current) return;
    
    if (shouldMove === true && mousePos.current !== null) {
      // ✅ Mobile par movement limit - LOCAL WALA (2.5)
      const moveLimit = isMobile ? 2.5 : 4;
      const targetX = mousePos.current.x * moveLimit;
      const targetY = mousePos.current.y * (isMobile ? 2.0 : 3);
      
      const dx = targetX - pos.current.x;
      const dy = targetY - pos.current.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      // ✅ Attraction distance - LOCAL WALA (2.5)
      const attractionDist = isMobile ? 2.5 : 3.5;
      if (dist < attractionDist) {
        const force = 0.05 * (1 - dist / attractionDist);
        vel.current.x += dx * force;
        vel.current.y += dy * force;
      } else {
        const backX = originalPos.current.x - pos.current.x;
        const backY = originalPos.current.y - pos.current.y;
        
        vel.current.x += backX * 0.04;
        vel.current.y += backY * 0.04;
      }
    } else {
      const backX = originalPos.current.x - pos.current.x;
      const backY = originalPos.current.y - pos.current.y;
      
      vel.current.x += backX * 0.04;
      vel.current.y += backY * 0.04;
    }
    
    vel.current.x *= 0.94;
    vel.current.y *= 0.94;
    
    pos.current.x += vel.current.x;
    pos.current.y += vel.current.y;
    
    groupRef.current.position.set(pos.current.x, pos.current.y, startPos[2]);
  });
  
  const getFontSize = (text: string): number => {
    if (isMobile) {
      // ✅ Mobile par font - LOCAL WALA
      if (text === "Discovery") return 0.22;
      if (text === "Design") return 0.21;
      if (text === "Development") return 0.18;
      if (text === "Testing") return 0.19;
      if (text === "Deployment") return 0.18;
      if (text === "Maintenance") return 0.17;
      return 0.19;
    }
    // Desktop original
    const baseSize = 0.32;
    if (text === "Discovery" || text === "Design") return baseSize;
    if (text === "Development") return 0.28;
    if (text === "Testing") return baseSize;
    if (text === "Deployment") return 0.28;
    if (text === "Maintenance") return 0.28;
    return 0.30;
  };
  
  const fontSize = getFontSize(title);
  
  return (
    <group ref={groupRef} position={[startPos[0], startPos[1], startPos[2]]}>
      {/* Main Ball */}
      <Sphere args={[size, 64, 64]}>
        <meshStandardMaterial 
          color={ballColor}
          metalness={0.5}
          roughness={0.2}
          emissive={glowColor}
          emissiveIntensity={0.12}
        />
      </Sphere>
      
      {/* Inner Glow */}
      <Sphere args={[size * 0.88, 64, 64]}>
        <meshStandardMaterial 
          color={ballColor}
          metalness={0.3}
          roughness={0.15}
          emissive={glowColor}
          emissiveIntensity={0.18}
          transparent
          opacity={0.6}
        />
      </Sphere>
      
      {/* TEXT */}
      <Text
        position={[0, 0, size + (isMobile ? 0.08 : 0.08)]}
        fontSize={fontSize}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
        fontStyle="bold"
        textAlign="center"
        renderOrder={1}
        outlineWidth={isMobile ? 0.015 : 0.02}
        outlineColor="#000000"
      >
        {title}
      </Text>
    </group>
  );
};

const ProcessBalls: React.FC<ProcessBallsProps> = ({ steps }) => {
  const mousePosition = useRef<MousePosition | null>(null);
  const [balls, setBalls] = useState<Array<{
    id: number;
    pos: [number, number, number];
    title: string;
    ballColor: string;
    glowColor: string;
  }>>([]);
  const [shouldMove, setShouldMove] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // ✅ Responsive pyramid positions - LOCAL WALE JESE
  const getResponsivePositions = (): [number, number, number][] => {
    if (isMobile) {
      // Mobile positions - LOCAL WALA
      return [
        [0, 2.6, 0],                           // Discovery
        [-1.7, 1.3, 0.1], [1.7, 1.3, -0.1],    // Design, Development
        [-2.5, 0, 0], [0, 0, 0.1], [2.5, 0, -0.1], // Testing, Deployment, Maintenance
      ];
    }
    // Desktop positions - original
    return [
      [0, 4.2, 0],                             // Discovery
      [-2.6, 2.2, 0.1], [2.6, 2.2, -0.1],      // Design, Development
      [-4.2, 0, 0], [0, 0, 0.1], [4.2, 0, -0.1], // Testing, Deployment, Maintenance
    ];
  };
  
  // ✅ Responsive camera position - LOCAL WALA
  const getCameraPosition = (): [number, number, number] => {
    if (isMobile) {
      return [0, 0.5, 12];  // LOCAL WALA
    }
    return [0, 0, 14];
  };
  
  // Ball colors
  const getBallColor = (title: string): { main: string; glow: string } => {
    return { main: "#FFFFFF", glow: "#FFFFFF" };
  };
  
  useEffect(() => {
    if (!steps || steps.length === 0) return;
    
    const positions = getResponsivePositions();
    
    const ballList: Array<{
      id: number;
      pos: [number, number, number];
      title: string;
      ballColor: string;
      glowColor: string;
    }> = [];
    
    for (let i = 0; i < steps.length && i < positions.length; i++) {
      const colors = getBallColor(steps[i].title);
      ballList.push({
        id: steps[i].id || i,
        pos: positions[i],
        title: steps[i].title || '',
        ballColor: colors.main,
        glowColor: colors.glow,
      });
    }
    setBalls(ballList);
  }, [steps, isMobile]);
  
  useEffect(() => {
    const sectionElement = sectionRef.current;
    if (!sectionElement) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.isIntersecting;
          setShouldMove(isVisible);
          
          if (!isVisible) {
            mousePosition.current = null;
          }
        });
      },
      { threshold: 0.1 }
    );
    
    observer.observe(sectionElement);
    
    return () => {
      if (sectionElement) {
        observer.unobserve(sectionElement);
      }
    };
  }, []);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (shouldMove === true) {
        mousePosition.current = {
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: (e.clientY / window.innerHeight) * 2 - 1
        };
        
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          mousePosition.current = null;
        }, 800);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeout) clearTimeout(timeout);
    };
  }, [shouldMove]);
  
  if (!steps || steps.length === 0) {
    return (
      <div style={{ 
        height: 'clamp(450px, 60vh, 500px)', 
        position: 'relative', 
        overflow: 'hidden',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFD700'
      }}>
        Loading Process...
      </div>
    );
  }
  
  // ✅ Responsive container height - LOCAL WALA
  const containerHeight = isMobile ? 'clamp(500px, 65vh, 550px)' : '750px';
  
  return (
    <div 
      ref={sectionRef}
      style={{ 
        height: containerHeight, 
        position: 'relative', 
        overflow: 'hidden',
        borderRadius: '24px',
        width: '100%'
      }}
    >
      <Canvas 
        camera={{ position: getCameraPosition(), fov: isMobile ? 50 : 45 }} 
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#FFFFFF" />
        <pointLight position={[-5, -3, 5]} intensity={0.6} color="#FFFFFF" />
        <pointLight position={[0, 7, 5]} intensity={0.7} color="#FFFFFF" />
        <pointLight position={[0, 0, 8]} intensity={0.5} color="#FFFFFF" />
        <directionalLight position={[2, 3, 4]} intensity={0.6} color="#FFFFFF" />
        
        {balls.map((ball) => (
          <ProcessBall 
            key={ball.id}
            startPos={ball.pos}
            mousePos={mousePosition}
            title={ball.title}
            shouldMove={shouldMove}
            ballColor={ball.ballColor}
            glowColor={ball.glowColor}
            isMobile={isMobile}
          />
        ))}
      </Canvas>
    </div>
  );
};

export default ProcessBalls;