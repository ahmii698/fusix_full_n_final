// PricingSection.tsx
import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../config';

interface Plan {
  id: number;
  name: string;
  price: string;
  period: string;
  is_recommended: number;
  button_text: string;
  features: string[];
}

const PricingSection = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ show: false, message: '', type: '' });

  // Fetch plans from API
  useEffect(() => {
    fetchPlans();
    fetchFeatures();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${API_URL}/pricing-plans`);
      const data = await response.json();
      setPlans(data.data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const fetchFeatures = async () => {
    try {
      const response = await fetch(`${API_URL}/pricing-features`);
      const data = await response.json();
      setFeatures(data.data || []);
    } catch (error) {
      console.error('Error fetching features:', error);
    }
  };

  const getPlanFeatures = (planId: number) => {
    return features
      .filter(f => f.plan_id === planId)
      .map(f => f.feature);
  };

  const handleGetStarted = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setLoading(true);
    setStatus({ show: false, message: '', type: '' });

    try {
      const response = await fetch(`${API_URL}/plan-purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: selectedPlan.id,
          plan_name: selectedPlan.name,
          price: selectedPlan.price,
          period: selectedPlan.period,
          ...formData
        }),
      });

      const data = await response.json();

      setStatus({
        show: true,
        message: data.message,
        type: 'success'
      });

      // Reset form
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        message: ''
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowModal(false);
        setStatus({ show: false, message: '', type: '' });
      }, 2000);

    } catch (error) {
      setStatus({
        show: true,
        message: 'Something went wrong. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pricing-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Pricing</span>
          <h2 className="section-title">Flexible <span className="golden-text">Plans</span></h2>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`pricing-card ${plan.is_recommended ? 'recommended' : ''}`}
            >
              {plan.is_recommended === 1 && (
                <div className="recommended-badge">Most Popular</div>
              )}
              <h3>{plan.name}</h3>
              <div className="pricing-price">
                <span className="price">{plan.price}</span>
                <span className="period">/{plan.period}</span>
              </div>
              <ul className="pricing-features">
                {getPlanFeatures(plan.id).map((feature, idx) => (
                  <li key={idx}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleGetStarted(plan)}
                className={`btn-${plan.is_recommended ? 'primary' : 'outline'} pricing-btn`}
              >
                {plan.button_text || 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedPlan && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            
            <h2>Get Started with {selectedPlan.name}</h2>
            <div className="modal-price">{selectedPlan.price} / {selectedPlan.period}</div>
            
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name *"
                value={formData.customer_name}
                onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Your Email *"
                value={formData.customer_email}
                onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.customer_phone}
                onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
              />
              <textarea
                placeholder="Message (Optional)"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={3}
              />
              
              {status.show && (
                <div className={`status-message ${status.type}`}>
                  {status.message}
                </div>
              )}

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Sending...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .pricing-section {
          padding: 80px 0;
          background: linear-gradient(135deg, #f5f7fa 0%, #e9ecf2 100%);
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .section-header {
          text-align: center;
          margin-bottom: 50px;
        }
        .section-subtitle {
          color: #4f46e5;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .section-title {
          font-size: 36px;
          color: #1f2937;
          margin: 10px 0 0;
        }
        .golden-text {
          color: #4f46e5;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-top: 50px;
        }
        .pricing-card {
          background: white;
          border-radius: 20px;
          padding: 40px 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          position: relative;
          transition: transform 0.3s;
        }
        .pricing-card:hover {
          transform: translateY(-5px);
        }
        .pricing-card.recommended {
          border: 2px solid #4f46e5;
          transform: scale(1.05);
        }
        .recommended-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #4f46e5;
          color: white;
          padding: 5px 20px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }
        .pricing-card h3 {
          font-size: 24px;
          margin-bottom: 20px;
          color: #333;
        }
        .pricing-price {
          margin-bottom: 30px;
        }
        .price {
          font-size: 48px;
          font-weight: 700;
          color: #4f46e5;
        }
        .period {
          font-size: 16px;
          color: #999;
        }
        .pricing-features {
          list-style: none;
          padding: 0;
          margin: 0 0 30px;
        }
        .pricing-features li {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
          color: #666;
        }
        .pricing-features svg {
          color: #4f46e5;
          flex-shrink: 0;
        }
        .pricing-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-primary {
          background: #4f46e5;
          color: white;
        }
        .btn-primary:hover {
          background: #4338ca;
        }
        .btn-outline {
          background: white;
          border: 2px solid #4f46e5;
          color: #4f46e5;
        }
        .btn-outline:hover {
          background: #4f46e5;
          color: white;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 40px;
          border-radius: 20px;
          max-width: 500px;
          width: 90%;
          position: relative;
        }
        .modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
        }
        .modal-content h2 {
          margin: 0 0 10px;
          color: #333;
        }
        .modal-price {
          font-size: 20px;
          font-weight: 600;
          color: #4f46e5;
          margin-bottom: 30px;
        }
        .modal-content input,
        .modal-content textarea {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 15px;
          outline: none;
          box-sizing: border-box;
        }
        .modal-content input:focus,
        .modal-content textarea:focus {
          border-color: #4f46e5;
        }
        .submit-btn {
          width: 100%;
          padding: 15px;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }
        .submit-btn:hover {
          background: #4338ca;
        }
        .submit-btn:disabled {
          background: #999;
          cursor: not-allowed;
        }
        .status-message {
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 15px;
          text-align: center;
        }
        .status-message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .status-message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
      `}</style>
    </section>
  );
};

export default PricingSection;