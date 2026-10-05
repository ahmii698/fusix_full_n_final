// src/components/pages/sections/FaqSection.tsx
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { clamp } from '../../../utils/responsive';
import axios from 'axios';
import { API_URL, STORAGE_URL } from '../../../../config';

const FaqSection = ({ faqs }: { faqs: any[] }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [faqImage, setFaqImage] = useState<string>('');
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const isMobile = window.innerWidth < 768;

  // Helper function to get image URL
  const getImageUrl = (imagePath: string | null): string => {
    if (!imagePath) return '';
    
    // Agar pexels ya koi external URL hai toh return empty (fallback nahi chahiye)
    if (imagePath.includes('pexels.com') || imagePath.includes('unsplash.com')) {
      return '';
    }
    
    // Agar already full URL hai
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Clean path - remove leading slashes
    let cleanPath = imagePath;
    
    // Agar /storage/ se start ho raha hai
    if (cleanPath.startsWith('/storage/')) {
      cleanPath = cleanPath.replace('/storage/', '');
    }
    
    // Remove any remaining leading slashes
    cleanPath = cleanPath.replace(/^\/+/, '');
    
    // STORAGE_URL use karo
    const finalUrl = `${STORAGE_URL}/${cleanPath}`;
    console.log('🔍 Image Path:', imagePath);
    console.log('🔍 Final URL:', finalUrl);
    
    return finalUrl;
  };

  // Fetch FAQ Image from API
  const fetchFaqImage = async () => {
    try {
      setImageLoading(true);
      
      console.log('📡 Fetching from:', `${API_URL}/faq_images`);
      
      const response = await axios.get(`${API_URL}/faq_images`);
      
      console.log('📦 API Response:', response.data);
      
      if (response.data?.success) {
        const imageData = response.data.data;
        
        // Agar data null hai ya image_url nahi hai
        if (!imageData || !imageData.image_url) {
          console.log('⚠️ No image data found');
          setFaqImage('');
          return;
        }
        
        // Agar Pexels fallback URL aaya hai backend se
        if (imageData.image_url.includes('pexels.com')) {
          console.log('⚠️ Backend sent Pexels fallback, ignoring');
          setFaqImage('');
          return;
        }
        
        const imageUrl = getImageUrl(imageData.image_url);
        console.log('✅ Setting image URL:', imageUrl);
        setFaqImage(imageUrl);
        
      } else {
        console.log('⚠️ API call failed');
        setFaqImage('');
      }
    } catch (error) {
      console.error('❌ Error fetching FAQ image:', error);
      setFaqImage('');
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqImage();
  }, []);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="faq-section" style={{ padding: 'clamp(40px, 10vw, 80px) 0', background: '#0A0A0A' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 'clamp(30px, 8vw, 60px)' }}>
          <span style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#FFD700', letterSpacing: '3px', fontWeight: '600', display: 'inline-block' }}>FAQ</span>
          <h2 style={{ 
            fontSize: 'clamp(28px, 6vw, 48px)', 
            margin: '15px 0', 
            color: '#fff', 
            fontWeight: '700',
            letterSpacing: '-1px'
          }}>
            Frequently Asked <span style={{ color: '#FFD700' }}>Questions</span>
          </h2>
          <p style={{ 
            fontSize: 'clamp(13px, 3vw, 16px)', 
            color: '#aaa', 
            marginTop: '10px', 
            lineHeight: '1.5',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Find answers to common questions about our services and process.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 'clamp(30px, 8vw, 60px)',
          alignItems: 'center'
        }}>
          
          {/* FAQ Image - Only show if real image exists */}
          {faqImage && !imageLoading && (
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 215, 0, 0.15)',
              background: '#1a1a1a',
              minHeight: isMobile ? '250px' : '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={faqImage}
                alt="FAQ Illustration"
                style={{
                  width: '100%',
                  height: '100%',
                  maxHeight: isMobile ? '250px' : '400px',
                  minHeight: isMobile ? '250px' : '400px',
                  objectFit: 'cover',
                  display: 'block'
                }}
                onError={(e) => {
                  console.error('❌ Image failed to load:', faqImage);
                  setFaqImage('');
                }}
              />
            </div>
          )}
          
          {/* Loading state */}
          {imageLoading && (
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 215, 0, 0.15)',
              background: '#1a1a1a',
              minHeight: isMobile ? '250px' : '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #333',
                borderTop: '3px solid #FFD700',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
          )}
          
          {/* FAQ Questions */}
          <div style={!faqImage ? { gridColumn: isMobile ? '1' : '1 / -1' } : {}}>
            {faqs.slice(0, 5).map((faq: any) => (
              <div key={faq.id} className="faq-item" style={{
                marginBottom: '12px',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                overflow: 'hidden',
                background: activeFaq === faq.id ? 'rgba(255,215,0,0.05)' : 'transparent',
                transition: 'background 0.3s ease'
              }}>
                <button 
                  onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                  style={{
                    width: '100%',
                    padding: 'clamp(12px, 4vw, 16px) clamp(16px, 4vw, 20px)',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: 'clamp(13px, 3.5vw, 16px)',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span style={{ flex: 1, paddingRight: '10px' }}>{faq.question}</span>
                  <ChevronRight size={clamp(16, 17, 18)} style={{
                    transition: 'transform 0.3s ease',
                    transform: activeFaq === faq.id ? 'rotate(90deg)' : 'rotate(0deg)',
                    color: '#FFD700',
                    flexShrink: 0
                  }} />
                </button>
                
                <div style={{
                  display: 'grid',
                  gridTemplateRows: activeFaq === faq.id ? '1fr' : '0fr',
                  transition: 'grid-template-rows 0.3s ease'
                }}>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{
                      padding: activeFaq === faq.id ? '0 20px 20px 20px' : '0 20px',
                      fontSize: 'clamp(12px, 3vw, 14px)',
                      lineHeight: '1.6',
                      color: '#ccc',
                      borderTop: activeFaq === faq.id ? '1px solid rgba(255,215,0,0.1)' : 'none'
                    }}>
                      <p style={{ margin: 0 }}>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default FaqSection;