// pages/sections/FeaturesSection.tsx
import { Globe, Palette, Smartphone, Database, Code, PenTool, Cpu, TrendingUp, Shield, Zap, Users, Rocket, Clock as ClockIcon, Target } from 'lucide-react';

const renderIcon = (iconName: string, size: number = 40) => {
  switch(iconName) {
    case 'Globe': return <Globe size={size} />;
    case 'Palette': return <Palette size={size} />;
    case 'Smartphone': return <Smartphone size={size} />;
    case 'Database': return <Database size={size} />;
    case 'Code': return <Code size={size} />;
    case 'PenTool': return <PenTool size={size} />;
    case 'Cpu': return <Cpu size={size} />;
    case 'TrendingUp': return <TrendingUp size={size} />;
    case 'Shield': return <Shield size={size} />;
    case 'Zap': return <Zap size={size} />;
    case 'Users': return <Users size={size} />;
    case 'Rocket': return <Rocket size={size} />;
    case 'Clock': return <ClockIcon size={size} />;
    case 'Target': return <Target size={size} />;
    default: return <Code size={size} />;
  }
};

const FeaturesSection = ({ features }: { features: any[] }) => {
  const clamp = (min: number, preferred: number, max: number) => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 768) return min;
      if (width > 1200) return max;
      return preferred;
    }
    return preferred;
  };

  if (!features || features.length === 0) return null;

  return (
    <section className="features-section" style={{ padding: 'clamp(40px, 10vw, 80px) 0', background: '#0A0A0A' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: 'clamp(30px, 8vw, 50px)' }}>
          <span className="section-subtitle" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#FFD700' }}>Why Choose Us</span>
          <h2 className="section-title" style={{ fontSize: 'clamp(28px, 6vw, 42px)', margin: '10px 0' }}>We Deliver <span style={{ color: '#FFD700' }}>Excellence</span></h2>
          <p className="section-description" style={{ fontSize: 'clamp(13px, 3vw, 16px)', color: '#aaa' }}>
            Combining technical expertise with creative innovation
          </p>
        </div>
        
        <div className="features-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 80vw, 280px), 1fr))',
          gap: 'clamp(20px, 5vw, 30px)'
        }}>
          {features.map((feature: any) => (
            <div key={feature.id} className="feature-card" style={{
              background: '#1a1a1a',
              borderRadius: '20px',
              padding: 'clamp(20px, 5vw, 30px)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.border = '1px solid rgba(255,215,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.border = 'none';
            }}>
              <div style={{ marginBottom: '20px', color: '#FFD700' }}>
                {renderIcon(feature.icon_name, clamp(32, 36, 40))}
              </div>
              <h3 style={{ fontSize: 'clamp(18px, 4vw, 22px)', marginBottom: '15px' }}>{feature.title}</h3>
              <p style={{ fontSize: 'clamp(12px, 3vw, 14px)', lineHeight: '1.6', color: '#ccc' }}>{feature.description}</p>
              {feature.stats && (
                <div style={{
                  marginTop: '15px',
                  fontSize: 'clamp(22px, 5vw, 28px)',
                  fontWeight: 'bold',
                  color: '#FFD700'
                }}>{feature.stats}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;