import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../config';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { clamp } from '../../../utils/responsive';

const ContactSection = ({ companyInfo, onBookAppointment }: { companyInfo: any, onBookAppointment: () => void }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', date: '', time: '', message: ''
  });
  const [formStatus, setFormStatus] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const isMobile = window.innerWidth < 768;

  // ❌ REMOVED AUTO-FOCUS - This was causing page to scroll down
  // No more nameInputRef and auto-focus effect

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
    setFormStatus('sending');

    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
      setToast({ message: 'Please fill all required fields', type: 'error' });
      setFormStatus('');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setToast({ message: 'Please enter a valid email address', type: 'error' });
      setFormStatus('');
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setToast({ message: 'Please enter a valid phone number (at least 10 digits)', type: 'error' });
      setFormStatus('');
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

      setFormStatus('success');
      setToast({ message: 'Appointment Booked Successfully!', type: 'success' });
      setFormData({ name: '', email: '', phone: '', date: '', time: '', message: '' });
      
      setTimeout(() => {
        setFormStatus('');
        setToast(null);
      }, 2000);
    } catch (error: any) {
      console.error('Error:', error);
      setFormStatus('error');
      setToast({ 
        message: error.response?.data?.message || 'Failed to book appointment. Please try again.', 
        type: 'error' 
      });
      setTimeout(() => setFormStatus(''), 2000);
    }
  };

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

      <section className="contact-section" style={{ padding: 'clamp(40px, 10vw, 80px) 0', background: '#0a0a0a' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'clamp(30px, 8vw, 50px)' }}>
            <span className="section-subtitle" style={{ fontSize: 'clamp(12px, 3vw, 14px)', color: '#FFD700' }}>Get In Touch</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(28px, 6vw, 42px)', margin: '10px 0' }}>Book Your <span style={{ color: '#FFD700' }}>Appointment</span></h2>
            <p className="section-description" style={{ fontSize: 'clamp(13px, 3vw, 16px)', color: '#aaa' }}>
              Schedule a consultation with our experts. We're here to help you grow your business.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'clamp(20px, 5vw, 40px)',
            alignItems: 'stretch'
          }}>
            {/* Google Map */}
            <div className="map-container" style={{ 
              width: '100%', 
              height: '100%', 
              minHeight: 'clamp(300px, 50vw, 450px)',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}>
              <iframe
                title="office-location"
                src={companyInfo?.map_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.636256472517!2d-122.088654484685!3d37.422408979825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba5b3c4c0f0d%3A0x8c3c5f5f5f5f5f5f!2sGoogleplex!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Contact Form - Same style as AppointmentModal */}
            <div style={{
              background: '#0a0a0a',
              padding: 'clamp(24px, 5vw, 32px)',
              borderRadius: '24px',
              border: '1px solid rgba(255,215,0,0.15)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,215,0,0.05)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '2px solid rgba(255,215,0,0.2)', paddingBottom: '16px' }}>
                <h3 style={{
                  margin: 0,
                  fontSize: 'clamp(20px, 5vw, 24px)',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Schedule a Meeting
                </h3>
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: 'clamp(11px, 3vw, 13px)',
                  color: '#888'
                }}>
                  Fill in your details and we'll get back to you
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(11px, 3vw, 13px)', fontWeight: '600', color: '#FFD700' }}>
                    Full Name <span style={{ color: '#FFD700' }}>*</span>
                  </label>
                  <input
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
                
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(11px, 3vw, 13px)', fontWeight: '600', color: '#FFD700' }}>
                    Email Address <span style={{ color: '#FFD700' }}>*</span>
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
                
                <div style={{ display: 'grid', gridTemplateColumns: isMobile && window.innerWidth < 500 ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(11px, 3vw, 13px)', fontWeight: '600', color: '#FFD700' }}>
                      Phone <span style={{ color: '#FFD700' }}>*</span>
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
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(11px, 3vw, 13px)', fontWeight: '600', color: '#FFD700' }}>
                      Date <span style={{ color: '#FFD700' }}>*</span>
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
                        colorScheme: 'dark'
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
                
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(11px, 3vw, 13px)', fontWeight: '600', color: '#FFD700' }}>
                    Time <span style={{ color: '#FFD700' }}>*</span>
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
                      colorScheme: 'dark'
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
                
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(11px, 3vw, 13px)', fontWeight: '600', color: '#aaa' }}>
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
                  disabled={formStatus === 'sending'}
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
                    opacity: formStatus === 'sending' ? 0.7 : 1,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => {
                    if (formStatus !== 'sending') {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,215,0,0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {formStatus === 'sending' ? (
                    <>⏳ Processing...</>
                  ) : (
                    <> Book Appointment <ArrowRight size={clamp(16, 17, 18)} /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

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
          transform: scale(1.1);
        }
      `}</style>
    </>
  );
};

export default ContactSection;