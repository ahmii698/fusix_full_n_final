// pages/modals/AppointmentModal.tsx
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../config';
import { Calendar, ArrowRight, X, CheckCircle, AlertCircle } from 'lucide-react';
import { clamp } from '../../../utils/responsive';

const AppointmentModal = ({ show, onClose }: { show: boolean, onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', date: '', time: '', message: ''
  });
  const [status, setStatus] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const isMobile = window.innerWidth < 500;
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on name input when modal opens
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [show]);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle phone number input - only numbers allowed
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = value.replace(/[^\d+]/g, '');
    setFormData({...formData, phone: cleaned});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
      setToast({ message: 'Please fill all required fields', type: 'error' });
      setStatus('');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setToast({ message: 'Please enter a valid email address', type: 'error' });
      setStatus('');
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setToast({ message: 'Please enter a valid phone number (at least 10 digits)', type: 'error' });
      setStatus('');
      return;
    }

    try {
      await axios.post(`${API_URL}/appointments`, {
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        appointment_date: formData.date,
        appointment_time: formData.time,
        message: formData.message
      });

      setStatus('success');
      setToast({ message: 'Appointment Booked Successfully!', type: 'success' });
      setFormData({ name: '', email: '', phone: '', date: '', time: '', message: '' });
      
      setTimeout(() => {
        onClose();
        setStatus('');
        setToast(null);
      }, 2000);
    } catch (error: any) {
      console.error('Error:', error);
      setStatus('error');
      setToast({ 
        message: error.response?.data?.message || 'Failed to book appointment. Please try again.', 
        type: 'error' 
      });
      setTimeout(() => setStatus(''), 2000);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Toast Notification - Bottom Right, Soft Yellow */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 1000000,
          animation: 'slideInRight 0.3s ease-out'
        }}>
          <div style={{
            background: toast.type === 'success' 
              ? 'rgba(255, 215, 0, 0.12)' 
              : 'rgba(239, 68, 68, 0.12)',
            backdropFilter: 'blur(12px)',
            color: toast.type === 'success' ? '#FFD700' : '#f87171',
            padding: '12px 20px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '500',
            boxShadow: toast.type === 'success' 
              ? '0 4px 15px rgba(255,215,0,0.15)' 
              : '0 4px 15px rgba(239,68,68,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: toast.type === 'success' 
              ? '1px solid rgba(255,215,0,0.25)' 
              : '1px solid rgba(239,68,68,0.25)',
          }}>
            {toast.type === 'success' ? (
              <CheckCircle size={16} color="#FFD700" />
            ) : (
              <AlertCircle size={16} color="#f87171" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        backdropFilter: 'blur(8px)',
        padding: '20px'
      }} onClick={onClose}>
        <div style={{
          backgroundColor: '#0a0a0a',
          padding: 'clamp(24px, 6vw, 40px)',
          borderRadius: '28px',
          width: '90%',
          maxWidth: '520px',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,215,0,0.1)',
          border: '1px solid rgba(255,215,0,0.15)',
          position: 'relative'
        }} onClick={(e) => e.stopPropagation()}>
          
          {/* ✨ CLOSE BUTTON - Top Right, More Visible */}
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255,215,0,0.3)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              color: '#FFD700',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFD700';
              e.currentTarget.style.borderColor = '#FFD700';
              e.currentTarget.style.color = '#000';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)';
              e.currentTarget.style.color = '#FFD700';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <X size={20} />
          </button>
          
          {/* Header - Centered with Bold Style */}
          <div style={{
            textAlign: 'center',
            marginBottom: '28px',
            borderBottom: '2px solid rgba(255,215,0,0.2)',
            paddingBottom: '20px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 0 20px rgba(255,215,0,0.3)'
            }}>
              <Calendar size={28} color="#000000" />
            </div>
            <h3 style={{
              margin: 0,
              fontSize: 'clamp(22px, 6vw, 26px)',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}>
              Schedule a Meeting
            </h3>
            <p style={{
              margin: '8px 0 0 0',
              fontSize: 'clamp(12px, 3vw, 13px)',
              color: '#888',
              fontWeight: '400'
            }}>
              Fill in your details and we'll get back to you
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(12px, 3vw, 13px)', fontWeight: '600', color: '#FFD700' }}>
                Full Name <span style={{ color: '#FFD700', fontSize: '12px' }}>*</span>
              </label>
              <input
                ref={nameInputRef}
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: 'clamp(12px, 3vw, 14px) clamp(14px, 4vw, 18px)',
                  borderRadius: '14px',
                  border: '2px solid rgba(255,215,0,0.2)',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: '#ffffff',
                  fontSize: 'clamp(13px, 3.5vw, 15px)',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  fontWeight: '400'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FFD700';
                  e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.05)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255,215,0,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,215,0,0.2)';
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(12px, 3vw, 13px)', fontWeight: '600', color: '#FFD700' }}>
                Email Address <span style={{ color: '#FFD700', fontSize: '12px' }}>*</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: 'clamp(12px, 3vw, 14px) clamp(14px, 4vw, 18px)',
                  borderRadius: '14px',
                  border: '2px solid rgba(255,215,0,0.2)',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: '#ffffff',
                  fontSize: 'clamp(13px, 3.5vw, 15px)',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FFD700';
                  e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.05)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255,215,0,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,215,0,0.2)';
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(12px, 3vw, 13px)', fontWeight: '600', color: '#FFD700' }}>
                  Phone <span style={{ color: '#FFD700', fontSize: '12px' }}>*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+92 XXX XXXXXXX"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  required
                  inputMode="numeric"
                  style={{
                    width: '100%',
                    padding: 'clamp(12px, 3vw, 14px) clamp(14px, 4vw, 18px)',
                    borderRadius: '14px',
                    border: '2px solid rgba(255,215,0,0.2)',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: '#ffffff',
                    fontSize: 'clamp(13px, 3.5vw, 15px)',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FFD700';
                    e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.05)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(255,215,0,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,215,0,0.2)';
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(12px, 3vw, 13px)', fontWeight: '600', color: '#FFD700' }}>
                  Date <span style={{ color: '#FFD700', fontSize: '12px' }}>*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: 'clamp(12px, 3vw, 14px) clamp(14px, 4vw, 18px)',
                    borderRadius: '14px',
                    border: '2px solid rgba(255,215,0,0.2)',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: '#ffffff',
                    fontSize: 'clamp(13px, 3.5vw, 15px)',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    colorScheme: 'dark',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FFD700';
                    e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.05)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(255,215,0,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,215,0,0.2)';
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(12px, 3vw, 13px)', fontWeight: '600', color: '#FFD700' }}>
                Time <span style={{ color: '#FFD700', fontSize: '12px' }}>*</span>
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: 'clamp(12px, 3vw, 14px) clamp(14px, 4vw, 18px)',
                  borderRadius: '14px',
                  border: '2px solid rgba(255,215,0,0.2)',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: '#ffffff',
                  fontSize: 'clamp(13px, 3.5vw, 15px)',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  colorScheme: 'dark',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FFD700';
                  e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.05)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255,215,0,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,215,0,0.2)';
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(12px, 3vw, 13px)', fontWeight: '600', color: '#aaa' }}>
                Message (Optional)
              </label>
              <textarea
                placeholder="Tell us what you'd like to discuss..."
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                style={{
                  width: '100%',
                  padding: 'clamp(12px, 3vw, 14px) clamp(14px, 4vw, 18px)',
                  borderRadius: '14px',
                  border: '2px solid rgba(255,215,0,0.2)',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: '#ffffff',
                  fontSize: 'clamp(13px, 3.5vw, 15px)',
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#FFD700';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.05)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,215,0,0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={status === 'sending'}
              style={{
                width: '100%',
                padding: 'clamp(14px, 3.5vw, 16px)',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: '#000000',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                fontSize: 'clamp(14px, 3.5vw, 16px)',
                fontWeight: '700',
                opacity: status === 'sending' ? 0.7 : 1,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              onMouseEnter={(e) => {
                if (status !== 'sending') {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,215,0,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {status === 'sending' ? (
                <> Processing...</>
              ) : (
                <> Book Appointment <ArrowRight size={clamp(16, 17, 18)} /></>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        /* Calendar and Time picker icons - WHITE color */
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: brightness(0) invert(1);
          cursor: pointer;
          opacity: 0.8;
          transition: all 0.3s ease;
        }
        
        input[type="date"]::-webkit-calendar-picker-indicator:hover,
        input[type="time"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
          filter: brightness(0) invert(0.8) sepia(1) saturate(5) hue-rotate(0deg);
          transform: scale(1.1);
        }
      `}</style>
    </>
  );
};

export default AppointmentModal;