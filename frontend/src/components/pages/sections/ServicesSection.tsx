// pages/sections/ServicesSection.tsx
import { ArrowRight, Globe, Palette, Smartphone, Database, Code, PenTool, Cpu, TrendingUp, Shield, Zap, Users, Rocket, Clock as ClockIcon, Target } from 'lucide-react';

const renderIcon = (iconName: string, size: number = 48) => {
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

const ServicesSection = ({ services }: { services: any[] }) => {
  const clamp = (min: number, preferred: number, max: number) => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 768) return min;
      if (width > 1200) return max;
      return preferred;
    }
    return preferred;
  };

  if (!services || services.length === 0) return null;

  return (
    <section className="services-section" style={{ padding: 'clamp(40px, 10vw, 80px) 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: 'clamp(30px, 8vw, 50px)' }}>
          <span className="section-subtitle" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#FFD700' }}>Our Services</span>
          <h2 className="section-title" style={{ fontSize: 'clamp(28px, 6vw, 42px)', margin: '10px 0' }}>What <span style={{ color: '#FFD700' }}>We Offer</span></h2>
          <p className="section-description" style={{ fontSize: 'clamp(13px, 3vw, 16px)', color: '#aaa' }}>
            Comprehensive IT solutions tailored to your business needs
          </p>
        </div>

        <div className="services-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 80vw, 300px), 1fr))',
          gap: 'clamp(20px, 5vw, 30px)'
        }}>
          {services.map((service: any) => (
            <div key={service.id} className="service-card" style={{
              background: '#1a1a1a',
              borderRadius: '20px',
              padding: 'clamp(20px, 5vw, 30px)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ marginBottom: '20px', color: '#FFD700' }}>
                {renderIcon(service.icon_name, clamp(36, 42, 48))}
              </div>
              <h3 style={{ fontSize: 'clamp(18px, 4vw, 24px)', marginBottom: '15px' }}>{service.title}</h3>
              <p style={{ fontSize: 'clamp(12px, 3vw, 14px)', lineHeight: '1.6', color: '#ccc' }}>{service.description}</p>
              
              <div className="service-features" style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                margin: '20px 0'
              }}>
                {service.features?.slice(0, 3).map((feature: any, idx: number) => (
                  <span key={idx} style={{
                    padding: '4px 10px',
                    background: 'rgba(255, 215, 0, 0.1)',
                    borderRadius: '20px',
                    fontSize: 'clamp(10px, 2.5vw, 12px)',
                    color: '#FFD700'
                  }}>{feature.feature || feature}</span>
                ))}
              </div>
              
              <a href={service.link || '#'} style={{
                color: '#FFD700',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: 'clamp(12px, 3vw, 14px)'
              }}>
                Learn More <ArrowRight size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;