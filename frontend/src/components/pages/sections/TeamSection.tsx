// src/components/pages/sections/TeamSection.tsx
import { Linkedin, Twitter } from 'lucide-react';
import { clamp } from '../../../utils/responsive';
import { useState, useEffect } from 'react';
import { API_URL, STORAGE_URL } from '../../../../config'; // ✅ STORAGE_URL import karo

// Local SVG placeholder (no external URL)
const LOCAL_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250" viewBox="0 0 300 250"%3E%3Crect width="300" height="250" fill="%231a1a1a"/%3E%3Ccircle cx="150" cy="100" r="40" fill="%23333"/%3E%3Crect x="120" y="160" width="60" height="10" rx="5" fill="%23333"/%3E%3Ctext x="150" y="210" text-anchor="middle" fill="%23666" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';

// Individual Team Card Component with flip state
const TeamCard = ({ member, isMobile }: { member: any; isMobile: boolean }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setImageTimestamp(Date.now());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ FIXED: getImageUrl function - ab STORAGE_URL use karega
  const getImageUrl = (url: string | null): string => {
    if (!url) return LOCAL_PLACEHOLDER;
    
    // Agar already full URL hai
    if (url.startsWith('http')) return url;
    
    // Clean the path
    let cleanUrl = url;
    
    // Agar /storage/ se start ho raha hai toh hatake STORAGE_URL ke saath jodo
    if (cleanUrl.startsWith('/storage/')) {
      cleanUrl = cleanUrl.replace('/storage/', '');
    }
    
    // Remove any leading slashes
    cleanUrl = cleanUrl.replace(/^\/+/, '');
    
    // ✅ STORAGE_URL use karo, API_URL nahi
    const finalUrl = `${STORAGE_URL}/${cleanUrl}?t=${imageTimestamp}`;
    
    console.log('🖼️ Team Image Original:', url); // Debug log
    console.log('🖼️ Team Image Final:', finalUrl); // Debug log
    
    return finalUrl;
  };

  const handleCardClick = () => {
    if (isMobile) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div 
      className="team-card-flip" 
      style={{
        background: 'transparent',
        width: '100%',
        height: 'clamp(300px, 55vw, 350px)',
        perspective: '1000px',
        cursor: 'pointer'
      }}
      onClick={handleCardClick}
    >
      <div 
        className="team-card-inner" 
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          textAlign: 'center',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transformStyle: 'preserve-3d',
          borderRadius: '16px',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
        onMouseEnter={(e) => {
          if (!isMobile) {
            e.currentTarget.style.transform = 'rotateY(180deg)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isMobile) {
            e.currentTarget.style.transform = 'rotateY(0deg)';
          }
        }}
      >
        {/* Front Side */}
        <div className="team-card-front" style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          background: '#1a1a1a',
          borderRadius: '16px',
          overflow: 'hidden',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ height: 'clamp(200px, 50vw, 250px)', overflow: 'hidden', flexShrink: 0 }}>
            <img 
              src={getImageUrl(member.image)} 
              alt={member.name} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                display: 'block'
              }} 
              onError={(e) => {
                console.error('❌ Team image load failed:', member.image);
                (e.target as HTMLImageElement).src = LOCAL_PLACEHOLDER;
              }}
            />
          </div>
          <div style={{ 
            padding: '12px 12px 16px 12px',
            backgroundColor: '#1a1a1a'
          }}>
            <h3 style={{ fontSize: 'clamp(16px, 4vw, 18px)', margin: 0, color: '#fff', fontWeight: 600 }}>{member.name}</h3>
            <p style={{ color: '#FFD700', fontSize: 'clamp(12px, 3vw, 14px)', margin: '5px 0 0 0', fontWeight: 500 }}>{member.role}</p>
          </div>
        </div>

        {/* Back Side */}
        <div className="team-card-back" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          background: 'linear-gradient(135deg, #1a1a1a, #0f0f0f)',
          borderRadius: '16px',
          transform: 'rotateY(180deg)',
          display: 'flex',
          flexDirection: 'column',
          padding: 'clamp(16px, 4vw, 20px)',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          overflowY: 'auto'
        }}>
          <h3 style={{ 
            fontSize: 'clamp(16px, 3.5vw, 18px)', 
            color: '#FFD700', 
            marginBottom: '10px',
            textAlign: 'left',
            borderBottom: '2px solid rgba(255,215,0,0.3)',
            paddingBottom: '8px'
          }}>
            {member.name}
          </h3>
          
          <div style={{ marginBottom: '12px', textAlign: 'left', flex: 1, overflowY: 'auto' }}>
            <p style={{ 
              fontSize: 'clamp(11px, 2.5vw, 13px)', 
              color: '#ccc', 
              lineHeight: '1.5',
              margin: 0
            }}>
              {member.about || member.expertise || 'Full-stack development expert specializing in React, Node.js, and cloud architecture.'}
            </p>
          </div>
          
          <div style={{ 
            marginBottom: '12px', 
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: 'clamp(10px, 2vw, 11px)', color: '#aaa', fontWeight: '500' }}>Exp:</span>
            <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#FFD700', fontWeight: '600' }}>{member.experience || '8+ years'}</span>
            <div style={{ 
              flex: 1, 
              height: '4px', 
              background: '#333', 
              borderRadius: '2px', 
              overflow: 'hidden'
            }}>
              <div style={{ width: '70%', height: '100%', background: '#FFD700', borderRadius: '2px' }} />
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            justifyContent: 'center',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255,215,0,0.15)'
          }}>
            {member.social_linkedin && member.social_linkedin !== '#' && (
              <a 
                href={member.social_linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  background: 'rgba(255,215,0,0.1)', 
                  padding: '8px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: 'clamp(28px, 6vw, 32px)', 
                  height: 'clamp(28px, 6vw, 32px)', 
                  transition: 'all 0.3s ease' 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FFD700';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,215,0,0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}>
                <Linkedin size={clamp(14, 15, 16)} color="#fff" />
              </a>
            )}
            {member.social_twitter && member.social_twitter !== '#' && (
              <a 
                href={member.social_twitter} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  background: 'rgba(255,215,0,0.1)', 
                  padding: '8px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: 'clamp(28px, 6vw, 32px)', 
                  height: 'clamp(28px, 6vw, 32px)', 
                  transition: 'all 0.3s ease' 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FFD700';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,215,0,0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}>
                <Twitter size={clamp(14, 15, 16)} color="#fff" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamSection = ({ team }: { team: any[] }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!team || team.length === 0) return null;

  const getGridColumns = () => {
    if (isMobile) return '1fr';
    if (isTablet) return 'repeat(2, 1fr)';
    return 'repeat(4, 1fr)';
  };

  return (
    <section className="team-section" style={{ padding: 'clamp(40px, 8vw, 60px) 0', background: '#0A0A0A' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: 'clamp(30px, 8vw, 40px)' }}>
          <span className="section-subtitle" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#FFD700' }}>Our Team</span>
          <h2 className="section-title" style={{ fontSize: 'clamp(28px, 6vw, 36px)', margin: '10px 0' }}>Meet The <span style={{ color: '#FFD700' }}>Experts</span></h2>
        </div>

        <div className="team-grid" style={{
          display: 'grid',
          gridTemplateColumns: getGridColumns(),
          gap: 'clamp(20px, 3vw, 30px)'
        }}>
          {team.map((member: any) => (
            <TeamCard key={member.id} member={member} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;