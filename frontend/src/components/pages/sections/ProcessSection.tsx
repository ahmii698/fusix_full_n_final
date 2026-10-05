// pages/sections/ProcessSection.tsx
import ProcessBalls from '../../../components/common/ProcessBalls';

const ProcessSection = ({ processSteps }: { processSteps: any[] }) => {
  if (!processSteps || processSteps.length === 0) return null;

  return (
    <section className="process-section" style={{ padding: 'clamp(40px, 10vw, 80px) 0', background: '#0A0A0A' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: 'clamp(30px, 8vw, 50px)' }}>
          <span className="section-subtitle" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#FFD700' }}>How We Work</span>
          <h2 className="section-title" style={{ fontSize: 'clamp(28px, 6vw, 42px)', margin: '10px 0' }}>Our <span style={{ color: '#FFD700' }}>Process</span></h2>
          <p className="section-description" style={{ fontSize: 'clamp(13px, 3vw, 16px)', color: '#aaa' }}>
            A streamlined approach to deliver exceptional results
          </p>
        </div>
        
        <ProcessBalls steps={processSteps} />
      </div>
    </section>
  );
};

export default ProcessSection;