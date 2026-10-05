// pages/sections/PricingSection.tsx
import { Check } from 'lucide-react';

const PricingSection = ({ pricing, onSelectPlan }: { pricing: any[], onSelectPlan: (plan: any) => void }) => {
  const clamp = (min: number, preferred: number, max: number) => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 768) return min;
      if (width > 1200) return max;
      return preferred;
    }
    return preferred;
  };

  if (!pricing || pricing.length === 0) return null;

  return (
    <section className="pricing-section" style={{ padding: 'clamp(40px, 10vw, 80px) 0', background: '#0A0A0A' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: 'clamp(30px, 8vw, 50px)' }}>
          <span className="section-subtitle" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#FFD700' }}>Pricing</span>
          <h2 className="section-title" style={{ fontSize: 'clamp(28px, 6vw, 42px)', margin: '10px 0' }}>Choose your <span style={{ color: '#FFD700' }}>plan</span></h2>
        </div>

        <div className="pricing-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(260px, 80vw, 300px), 1fr))',
          gap: 'clamp(20px, 5vw, 30px)'
        }}>
          {pricing.map((plan: any) => (
            <div key={plan.id} style={{
              background: plan.is_recommended ? 'linear-gradient(145deg, #1f1f1f, #141414)' : '#1a1a1a',
              borderRadius: '20px',
              padding: 'clamp(25px, 6vw, 35px)',
              textAlign: 'center',
              position: 'relative',
              border: plan.is_recommended ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',
              transform: plan.is_recommended ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = plan.is_recommended ? 'scale(1.05)' : 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = plan.is_recommended ? 'scale(1.02)' : 'scale(1)';
            }}>
              {plan.is_recommended && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: 'clamp(10px, 3vw, 20px)',
                  background: '#FFD700',
                  color: '#000',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: 'clamp(10px, 2.5vw, 12px)',
                  fontWeight: 'bold'
                }}>
                  Recommended
                </div>
              )}
              <h3 style={{ fontSize: 'clamp(20px, 5vw, 26px)', marginBottom: '20px' }}>{plan.name}</h3>
              <div style={{ marginBottom: '25px' }}>
                <span style={{ fontSize: 'clamp(36px, 8vw, 48px)', fontWeight: 'bold', color: '#FFD700' }}>{plan.price}</span>
                <span style={{ fontSize: 'clamp(12px, 3vw, 16px)' }}>/{plan.period}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 25px 0' }}>
                {plan.features?.slice(0, 4).map((feature: any, idx: number) => (
                  <li key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px',
                    fontSize: 'clamp(12px, 3vw, 14px)'
                  }}>
                    <Check size={clamp(12, 14, 16)} color="#FFD700" /> {feature.feature || feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => onSelectPlan(plan)}
                style={{
                  width: '100%',
                  padding: 'clamp(10px, 3vw, 14px)',
                  background: plan.is_recommended ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'rgba(255,215,0,0.2)',
                  border: 'none',
                  borderRadius: '10px',
                  color: plan.is_recommended ? '#000' : '#FFD700',
                  cursor: 'pointer',
                  fontSize: 'clamp(13px, 3.5vw, 16px)',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                {plan.button_text || 'Select plan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;