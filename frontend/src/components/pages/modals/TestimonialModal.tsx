// src/components/pages/modals/TestimonialModal.tsx
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../config';
import { Star, X } from 'lucide-react';

const clamp = (min: number, preferred: number, max: number) => {
  if (typeof window !== 'undefined') {
    const width = window.innerWidth;
    if (width < 768) return min;
    if (width > 1200) return max;
    return preferred;
  }
  return preferred;
};

const TestimonialModal = ({ show, onClose }: { show: boolean, onClose: () => void }) => {
  const [formData, setFormData] = useState({ name: '', testimonial: '', rating: 5 });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    if (!formData.name || !formData.testimonial) {
      alert('Please fill all required fields');
      setStatus('');
      return;
    }
    
    try {
      await axios.post(`${API_URL}/testimonials`, {
        client_name: formData.name,
        testimonial_text: formData.testimonial,
        rating: formData.rating
      });
      
      setStatus('success');
      alert('✅ Thank you! Your testimonial will be reviewed and published soon.');
      setFormData({ name: '', testimonial: '', rating: 5 });
      setTimeout(() => {
        onClose();
        setStatus('');
      }, 1500);
    } catch (error: any) {
      console.error('Error:', error);
      setStatus('error');
      alert('❌ Error: ' + (error.response?.data?.message || 'Failed to submit'));
      setTimeout(() => setStatus(''), 2000);
    }
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999,
      backdropFilter: 'blur(5px)',
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: 'clamp(24px, 6vw, 32px)',
        borderRadius: '24px',
        width: '90%',
        maxWidth: '450px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 215, 0, 0.2)'
      }} onClick={(e) => e.stopPropagation()}>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          borderBottom: '1px solid rgba(255, 215, 0, 0.2)',  // ← YEH LINE FIX KARO
          paddingBottom: '16px'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: 'clamp(20px, 5vw, 22px)',
            fontWeight: '600',
            color: '#FFD700'
          }}>
            Share Your Experience
          </h3>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              cursor: 'pointer',
              color: '#fff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(12px, 3vw, 13px)', color: '#aaa' }}>
              Your Name *
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={{
                width: '100%',
                padding: 'clamp(10px, 3vw, 12px) clamp(12px, 4vw, 16px)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: 'clamp(13px, 3.5vw, 14px)',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(12px, 3vw, 13px)', color: '#aaa' }}>
              Your Rating *
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({...formData, rating: star})}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <Star size={clamp(24, 28, 30)} fill={star <= formData.rating ? "#FFD700" : "none"} color="#FFD700" />
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'clamp(12px, 3vw, 13px)', color: '#aaa' }}>
              Your Testimonial *
            </label>
            <textarea
              placeholder="Share your experience..."
              rows={4}
              value={formData.testimonial}
              onChange={(e) => setFormData({...formData, testimonial: e.target.value})}
              required
              style={{
                width: '100%',
                padding: 'clamp(10px, 3vw, 12px) clamp(12px, 4vw, 16px)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: 'clamp(13px, 3.5vw, 14px)',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={status === 'sending'}
            style={{
              width: '100%',
              padding: 'clamp(12px, 3vw, 14px)',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              color: '#000',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: 'clamp(14px, 3.5vw, 15px)',
              fontWeight: '600',
              opacity: status === 'sending' ? 0.7 : 1
            }}
          >
            {status === 'sending' ? 'Submitting...' : 'Submit Testimonial'}
          </button>
          
          <p style={{ fontSize: 'clamp(10px, 2.5vw, 11px)', color: '#666', textAlign: 'center', marginTop: '16px' }}>
            Your testimonial will be reviewed before publishing.
          </p>
        </form>
      </div>
    </div>
  );
};

export default TestimonialModal;