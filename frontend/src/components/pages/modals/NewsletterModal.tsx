// pages/modals/NewsletterModal.tsx
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../config';
import { Mail, X } from 'lucide-react';

const NewsletterModal = ({ show, onClose }: { show: boolean, onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const audioRef = useRef<any>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Initialize Audio Context
  useEffect(() => {
    if (!audioInitialized) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      
      const playBeep = () => {
        try {
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          oscillator.frequency.value = 880;
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.8);
          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.8);
        } catch (err) {
          console.log('Play error:', err);
        }
      };
      
      audioRef.current = { 
        play: playBeep, 
        context: audioCtx,
        resume: () => audioCtx.resume()
      };
      
      setAudioInitialized(true);
    }
  }, [audioInitialized]);

  const playSound = async () => {
    if (!audioRef.current) {
      console.log('Audio not initialized');
      return;
    }
    
    try {
      const ctx = audioRef.current.context;
      // Resume context if suspended
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      // Small delay to ensure context is running
      setTimeout(() => {
        audioRef.current.play();
      }, 100);
    } catch (error) {
      console.error('Sound error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/newsletter`, { email });
      
      if (response.data.success) {
        setStatus('success');
        localStorage.setItem('sound_enabled', 'true');
        
        // Play sound after successful subscription
        await playSound();
        
        setTimeout(() => {
          onClose();
          setStatus('');
          setEmail('');
        }, 1500);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error('Newsletter error:', error);
      setStatus('error');
      setError(error.response?.data?.message || 'Email already subscribed or invalid');
      setTimeout(() => {
        setStatus('');
        setError('');
      }, 2000);
    }
  };

  const handleClose = async () => {
    localStorage.setItem('sound_enabled', 'true');
    await playSound();
    onClose();
  };

  // Initialize audio context on first user interaction
  const initAudioOnUserInteraction = async () => {
    if (audioRef.current && audioRef.current.context.state === 'suspended') {
      await audioRef.current.context.resume();
    }
  };

  if (!show) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(12px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={initAudioOnUserInteraction}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg, #111111, #0a0a0a)',
          borderRadius: '28px',
          padding: '32px 28px',
          maxWidth: '380px',
          width: '88%',
          textAlign: 'center',
          border: '1px solid rgba(255, 215, 0, 0.25)',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 215, 0, 0.05) inset',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            color: '#FFD700'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#FFD700';
            e.currentTarget.style.borderColor = '#FFD700';
            e.currentTarget.style.color = '#000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.2)';
            e.currentTarget.style.color = '#FFD700';
          }}
        >
          <X size={14} />
        </button>

        {/* Glowing Email Icon */}
        <div
          style={{
            width: '70px',
            height: '70px',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.4)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
        >
          <Mail size={34} color="#000" />
        </div>
        
        <h2 style={{
          fontSize: '22px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '8px',
          letterSpacing: '-0.5px'
        }}>
          Exclusive Updates
        </h2>
        
        <p style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.7)',
          lineHeight: '1.5',
          marginBottom: '20px'
        }}>
          Get <span style={{ color: '#FFD700', fontWeight: '600' }}>VIP tech insights</span> and offers delivered to your inbox.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{
            position: 'relative',
            marginBottom: '14px'
          }}>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '50px',
                border: '2px solid rgba(255, 215, 0, 0.25)',
                background: 'rgba(0, 0, 0, 0.5)',
                color: '#fff',
                fontSize: '12px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FFD700';
                e.target.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.2)';
                e.target.style.background = 'rgba(0, 0, 0, 0.7)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 215, 0, 0.25)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'rgba(0, 0, 0, 0.5)';
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={status === 'sending'}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              border: 'none',
              borderRadius: '50px',
              color: '#000',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              opacity: status === 'sending' ? 0.7 : 1
            }}
          >
            {status === 'sending' ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span className="spinner" style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid #000',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  display: 'inline-block'
                }}></span>
                Subscribing...
              </span>
            ) : (
              'Subscribe →'
            )}
          </button>
          
          {status === 'success' && (
            <p style={{ color: '#4ade80', fontSize: '11px', marginTop: '12px', marginBottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span>✓</span> Welcome VIP! Sound enabled.
            </p>
          )}
          {status === 'error' && (
            <p style={{ color: '#f87171', fontSize: '11px', marginTop: '12px', marginBottom: 0 }}>
              {error}
            </p>
          )}
        </form>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default NewsletterModal;