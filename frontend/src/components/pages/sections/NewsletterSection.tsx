// src/components/pages/sections/NewsletterSection.tsx
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../config';
import { Send } from 'lucide-react';
import { clamp } from '../../../utils/responsive';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    
    try {
      const response = await axios.post(`${API_URL}/newsletter`, { email });
      
      if (response.data.success) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus(''), 3000);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error('Newsletter error:', error);
      setStatus('error');
      setErrorMsg(error.response?.data?.message || 'Email already subscribed or invalid');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <section className="newsletter-section" style={{ padding: 'clamp(40px, 10vw, 80px) 0', background: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div className="newsletter-content" style={{
          textAlign: 'center',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <h3 style={{ fontSize: 'clamp(22px, 6vw, 28px)', marginBottom: '12px', color: '#fff', fontWeight: '700' }}>
            Subscribe to Our Newsletter
          </h3>
          <p style={{ fontSize: 'clamp(13px, 3.5vw, 14px)', marginBottom: '25px', color: '#aaa' }}>
            Get the latest tech insights and updates directly in your inbox
          </p>
          
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            width: '100%'
          }}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                maxWidth: '380px',
                padding: 'clamp(12px, 3vw, 14px) clamp(16px, 4vw, 20px)',
                borderRadius: '50px',
                border: '2px solid rgba(255,215,0,0.2)',
                background: 'rgba(0, 0, 0, 0.5)',
                color: '#fff',
                fontSize: 'clamp(13px, 3.5vw, 14px)',
                outline: 'none',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FFD700';
                e.target.style.boxShadow = '0 0 0 3px rgba(255,215,0,0.1)';
                e.target.style.background = 'rgba(255,215,0,0.05)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,215,0,0.2)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'rgba(0, 0, 0, 0.5)';
              }}
            />
            
            <button 
              type="submit" 
              disabled={status === 'sending'} 
              style={{
                padding: 'clamp(8px, 2.5vw, 10px) clamp(24px, 5vw, 32px)',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                border: 'none',
                borderRadius: '50px',
                color: '#000',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: 'clamp(12px, 3vw, 14px)',
                transition: 'all 0.3s ease',
                opacity: status === 'sending' ? 0.7 : 1,
                width: 'auto',
                minWidth: '140px'
              }}
              onMouseEnter={(e) => {
                if (status !== 'sending') {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 20px rgba(255,215,0,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {status === 'sending' ? (
                <>
                  <span style={{
                    width: '14px',
                    height: '14px',
                    border: '2px solid #000',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    display: 'inline-block'
                  }}></span>
                  Subscribing...
                </>
              ) : (
                <>
                  Subscribe <Send size={14} />
                </>
              )}
            </button>
          </form>
          
          {status === 'success' && (
            <p style={{ color: '#4ade80', marginTop: '16px', fontSize: 'clamp(12px, 3vw, 13px)' }}>
              ✓ Subscribed successfully!
            </p>
          )}
          {status === 'error' && (
            <p style={{ color: '#f87171', marginTop: '16px', fontSize: 'clamp(12px, 3vw, 13px)' }}>
              ❌ {errorMsg}
            </p>
          )}
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

export default NewsletterSection;