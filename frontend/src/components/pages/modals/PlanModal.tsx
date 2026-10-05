// pages/modals/PlanModal.tsx
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../config';
import { X } from 'lucide-react';

const PlanModal = ({ show, plan, onClose }: { show: boolean, plan: any, onClose: () => void }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill all required fields');
      setStatus('');
      return;
    }
    
    try {
      await axios.post(`${API_URL}/plan-purchase`, {
        plan_id: plan.id.toString(),
        plan_name: plan.name,
        price: plan.price,
        period: plan.period,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        message: formData.message,
        status: 'pending'
      });
      
      setStatus('success');
      alert('✅ Request submitted successfully! We will contact you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => {
        onClose();
        setStatus('');
      }, 1500);
    } catch (error: any) {
      console.error('Error:', error);
      setStatus('error');
      alert('❌ Error: ' + (error.response?.data?.message || error.message));
      setTimeout(() => setStatus(''), 2000);
    }
  };

  if (!show || !plan) return null;

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
      zIndex: 9999,
      backdropFilter: 'blur(5px)',
      padding: '20px'
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(255,255,255,0.1)',
          border: 'none',
          borderRadius: '50%',
          width: '35px',
          height: '35px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <X size={20} color="#fff" />
        </button>
        
        <div style={{ padding: 'clamp(20px, 5vw, 30px)' }}>
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ fontSize: 'clamp(24px, 6vw, 28px)', marginBottom: '5px', color: '#fff' }}>Get started</h3>
            <p style={{ color: '#FFD700', fontSize: 'clamp(14px, 3.5vw, 16px)' }}>{plan.name} plan - {plan.price}/{plan.period}</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <input 
                type="text" 
                placeholder="Full name"
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
                style={{
                  width: '100%',
                  padding: 'clamp(12px, 3vw, 14px)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: 'clamp(14px, 3.5vw, 16px)'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <input 
                type="email" 
                placeholder="Email address"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
                style={{
                  width: '100%',
                  padding: 'clamp(12px, 3vw, 14px)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: 'clamp(14px, 3.5vw, 16px)'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <input 
                type="tel" 
                placeholder="Phone number"
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                required 
                style={{
                  width: '100%',
                  padding: 'clamp(12px, 3vw, 14px)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: 'clamp(14px, 3.5vw, 16px)'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <textarea 
                placeholder="Anything else?"
                rows={3} 
                value={formData.message} 
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                style={{
                  width: '100%',
                  padding: 'clamp(12px, 3vw, 14px)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <button type="submit" disabled={status === 'sending'} style={{
              width: '100%',
              padding: 'clamp(12px, 3vw, 14px)',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              border: 'none',
              borderRadius: '10px',
              color: '#000',
              fontWeight: '600',
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              {status === 'sending' ? 'Processing...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlanModal;