// pages/sections/TestimonialsSection.tsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { clamp } from '../../../utils/responsive';

const TestimonialsSection = ({ testimonials, onAddTestimonial }: { testimonials: any[], onAddTestimonial: () => void }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const isMobile = window.innerWidth < 768;

  if (!testimonials || testimonials.length === 0) return null;

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="testimonials-section" style={{ padding: 'clamp(40px, 10vw, 80px) 0', background: '#0A0A0A' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: 'clamp(30px, 8vw, 50px)' }}>
          <span className="section-subtitle" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#FFD700' }}>Testimonials</span>
          <h2 className="section-title" style={{ fontSize: 'clamp(28px, 6vw, 42px)', margin: '10px 0' }}>What <span style={{ color: '#FFD700' }}>Clients</span> Say</h2>
          
          <button
            onClick={onAddTestimonial}
            style={{
              marginTop: '20px',
              padding: 'clamp(8px, 2vw, 10px) clamp(16px, 4vw, 24px)',
              background: 'transparent',
              border: '2px solid #FFD700',
              borderRadius: '50px',
              color: '#FFD700',
              fontSize: 'clamp(12px, 3vw, 14px)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFD700';
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#FFD700';
            }}
          >
            <Star size={clamp(14, 15, 16)} /> Share Your Experience
          </button>
        </div>

        <div className="testimonials-slider" style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
          <button onClick={prevTestimonial} style={{
            position: 'absolute',
            left: isMobile ? '-30px' : '-50px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,215,0,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: 'clamp(32px, 8vw, 40px)',
            height: 'clamp(32px, 8vw, 40px)',
            cursor: 'pointer',
            display: isMobile ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}>
            <ChevronLeft size={clamp(20, 22, 24)} color="#FFD700" />
          </button>
          
          <div className="testimonials-container" style={{ position: 'relative', height: 'clamp(350px, 60vh, 400px)' }}>
            {testimonials.map((testimonial: any, index: number) => {
              const isActive = index === currentTestimonial;
              const isPrev = index === (currentTestimonial - 1 + testimonials.length) % testimonials.length;
              const isNext = index === (currentTestimonial + 1) % testimonials.length;
              
              let scale = 0.6;
              let zIndex = 1;
              let opacity = 0;
              
              if (isActive) {
                scale = 1;
                zIndex = 3;
                opacity = 1;
              } else if (isPrev || isNext) {
                scale = 0.8;
                zIndex = 2;
                opacity = 0.8;
              }
              
              return (
                <div
                  key={testimonial.id}
                  style={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) scale(${scale})`,
                    width: '100%',
                    maxWidth: '500px',
                    transition: 'all 0.5s ease',
                    zIndex: zIndex,
                    opacity: opacity,
                    pointerEvents: isActive ? 'auto' : 'none'
                  }}
                >
                  <div className="testimonial-card" style={{
                    background: '#1a1a1a',
                    borderRadius: '20px',
                    padding: 'clamp(25px, 6vw, 35px)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <p style={{
                      fontSize: 'clamp(13px, 3.5vw, 16px)',
                      lineHeight: '1.6',
                      marginBottom: '25px',
                      fontStyle: 'italic',
                      flex: 1
                    }}>"{testimonial.testimonial_text || testimonial.text}"</p>
                    
                    <h4 style={{ 
                      fontSize: 'clamp(16px, 4vw, 18px)', 
                      marginBottom: '12px', 
                      color: '#fff',
                      fontWeight: '600'
                    }}>
                      {testimonial.client_name || testimonial.name || 'Client'}
                    </h4>
                    
                    <div className="testimonial-rating" style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '5px'
                    }}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={clamp(16, 17, 18)} 
                          fill={i < (testimonial.rating || 5) ? "#FFD700" : "none"} 
                          color="#FFD700" 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={nextTestimonial} style={{
            position: 'absolute',
            right: isMobile ? '-30px' : '-50px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,215,0,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: 'clamp(32px, 8vw, 40px)',
            height: 'clamp(32px, 8vw, 40px)',
            cursor: 'pointer',
            display: isMobile ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}>
            <ChevronRight size={clamp(20, 22, 24)} color="#FFD700" />
          </button>

          <div className="slider-dots" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '30px'
          }}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                style={{
                  width: index === currentTestimonial ? 'clamp(25px, 6vw, 30px)' : 'clamp(8px, 2vw, 10px)',
                  height: 'clamp(8px, 2vw, 10px)',
                  borderRadius: '5px',
                  background: index === currentTestimonial ? '#FFD700' : 'rgba(255,215,0,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;