// components/common/LoadingScreen.tsx
import { useEffect } from 'react';

const LoadingScreen = () => {
  // Disable scroll when loading screen is active
  useEffect(() => {
    // Save original overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Disable scroll
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';
    
    // Re-enable scroll when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };
  }, []);

  return (
    <div style={{ 
      background: '#0A0A0A', 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden' // Extra safety
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 'clamp(60px, 15vw, 80px)',
          height: 'clamp(60px, 15vw, 80px)',
          margin: '0 auto',
          position: 'relative',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            borderRadius: '20px',
            transform: 'rotate(45deg)',
            animation: 'spin 2s linear infinite'
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 'clamp(24px, 8vw, 32px)',
            fontWeight: 'bold',
            color: '#000'
          }}>F</div>
        </div>
        
        <h1 style={{ 
          fontSize: 'clamp(22px, 6vw, 28px)', 
          color: '#FFD700', 
          marginTop: 'clamp(20px, 8vw, 30px)',
          marginBottom: 'clamp(15px, 5vw, 20px)',
          fontWeight: '700',
          letterSpacing: '2px',
          animation: 'fadeInUp 0.8s ease'
        }}>
          Fusix Tech
        </h1>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <div key={i} style={{
              width: 'clamp(8px, 3vw, 12px)',
              height: 'clamp(8px, 3vw, 12px)',
              background: '#FFD700',
              borderRadius: '50%',
              animation: 'bounce 1.4s ease-in-out infinite',
              animationDelay: `${delay}s`
            }} />
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }
        @keyframes spin { 0% { transform: rotate(45deg); } 100% { transform: rotate(405deg); } }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-15px); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        /* Extra safety - no scroll bars */
        body, html {
          overflow: hidden !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;