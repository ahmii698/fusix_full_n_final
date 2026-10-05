// src/components/pages/sections/HeroSection.tsx
import { SplineSceneBasic } from '../../demo/SplineSceneBasic';

const HeroSection = () => {
  const isMobile = window.innerWidth < 768;
  
  return (
    <section style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      minHeight: '100vh',
      overflow: 'hidden',
      background: '#0A0A0A',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center'
    }}>
      {/* Background gradients */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: 'clamp(150px, 40vw, 500px)',
        height: 'clamp(150px, 40vw, 500px)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,215,0,0.08), transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '5%',
        width: 'clamp(150px, 30vw, 400px)',
        height: 'clamp(150px, 30vw, 400px)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,215,0,0.05), transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Content */}
      <div style={{
        flex: 1,
        zIndex: 2,
        textAlign: isMobile ? 'center' : 'left',
        color: '#fff',
        padding: isMobile ? '20px' : '40px',
        paddingLeft: isMobile ? '20px' : '8%',
        maxWidth: isMobile ? '100%' : '45%'
      }}>
        <span style={{
          fontSize: 'clamp(10px, 3vw, 18px)',
          letterSpacing: '4px',
          color: '#FFD700',
          display: 'block',
          marginBottom: '15px',
          fontWeight: '600'
        }}>WELCOME TO FUSIX TECH</span>
        
        <h1 style={{
          fontSize: 'clamp(24px, 7vw, 68px)',
          margin: '15px 0',
          lineHeight: '1.2',
          fontWeight: '800',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          Innovative <span style={{ color: '#FFD700' }}>IT Solutions</span><br />
          For Your Business
        </h1>
        
        <p style={{
          fontSize: 'clamp(12px, 3.5vw, 20px)',
          marginBottom: '30px',
          opacity: 0.95,
          lineHeight: '1.5',
          maxWidth: isMobile ? '100%' : '550px'
        }}>
          We deliver cutting-edge technology solutions that drive growth, 
          enhance security, and transform your digital presence.
        </p>
        
        <div>
          <button style={{
            padding: 'clamp(10px, 2.5vw, 16px) clamp(20px, 5vw, 40px)',
            fontSize: 'clamp(12px, 3.5vw, 16px)',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            border: 'none',
            borderRadius: '50px',
            color: '#000',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(255,215,0,0.4)'
          }}>Get Started</button>
        </div>
      </div>

      {/* 3D Spline */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: isMobile ? '45%' : '70%',
        position: 'relative',
        zIndex: 1,
        paddingRight: isMobile ? '0' : '40px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: isMobile ? '100%' : '550px',
          height: '100%',
          position: 'relative',
          transform: isMobile ? 'scale(1.4)' : 'scale(1.15)',
          transformOrigin: 'center'
        }}>
          <SplineSceneBasic />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;