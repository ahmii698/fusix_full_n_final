// pages/sections/StatsSection.tsx
import { Trophy, Users, Rocket, Award, Target, BarChart, Sparkles, Activity } from 'lucide-react';

const statIcons = [
  <Trophy size={48} color="#FFD700" />,
  <Users size={48} color="#FFD700" />,
  <Rocket size={48} color="#FFD700" />,
  <Award size={48} color="#FFD700" />,
  <Target size={48} color="#FFD700" />,
  <BarChart size={48} color="#FFD700" />,
  <Sparkles size={48} color="#FFD700" />,
  <Activity size={48} color="#FFD700" />
];

const StatsSection = ({ statistics }: { statistics: any[] }) => {
  if (!statistics || statistics.length === 0) return null;

  return (
    <section className="stats-section" style={{ background: '#0A0A0A', padding: 'clamp(40px, 10vw, 80px) 0', overflow: 'hidden' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: 'clamp(30px, 8vw, 50px)' }}>
          <span className="section-subtitle" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#FFD700' }}>Our Achievements</span>
          <h2 className="section-title" style={{ fontSize: 'clamp(28px, 6vw, 42px)', margin: '10px 0' }}>Company <span style={{ color: '#FFD700' }}>Statistics</span></h2>
        </div>
        
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', animation: 'scrollStats 30s linear infinite', width: 'fit-content' }}>
            {[...statistics, ...statistics].map((stat: any, index: number) => (
              <div key={`${stat.id}-${index}`} style={{ flex: '0 0 auto', padding: '0 15px' }}>
                <div style={{
                  background: 'transparent',
                  borderRadius: '20px',
                  padding: 'clamp(20px, 5vw, 30px)',
                  textAlign: 'center',
                  minWidth: 'clamp(160px, 40vw, 200px)',
                  border: '1px solid rgba(255,215,0,0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = '#FFD700';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)';
                }}>
                  <div style={{ marginBottom: '15px' }}>{statIcons[index % statIcons.length]}</div>
                  <h2 style={{ fontSize: 'clamp(28px, 6vw, 42px)', margin: '10px 0', color: '#FFD700' }}>{stat.value}{stat.suffix || ''}</h2>
                  <p style={{ fontSize: 'clamp(11px, 3vw, 14px)', color: '#aaa' }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scrollStats {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default StatsSection;