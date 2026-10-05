// pages/Contact.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { API_URL } from '../../../config';
import {
  MessageCircle, Globe
} from 'lucide-react';
import SEO from '../SEO';

import ContactSection from './sections/ContactSection';
import FaqSection from './sections/FaqSection';

import './Contact.css';

const ADDRESS_LINES = [
  'Rua Fernão de Magalhães, Cerro Alagoa',
  'Apt L11, Lote 20',
  '8200-129 Albufeira, Portugal',
];
const ADDRESS_QUERY = encodeURIComponent(
  'Rua Fernão de Magalhães, Cerro Alagoa, 8200-129 Albufeira, Portugal'
);

const COMPANY = {
  email: 'fusixtech@gmail.com',
  phone: '+351 920 348 944',
  phoneRaw: '+351920348944',
  addressLines: ADDRESS_LINES,
  mapsLink: `https://www.google.com/maps/search/?api=1&query=${ADDRESS_QUERY}`,
  mapsEmbed: `https://www.google.com/maps?q=${ADDRESS_QUERY}&output=embed`,
};

const SOCIALS = {
  facebook: 'https://www.facebook.com/FusixTech',
  twitter: 'https://x.com/FusixTech',
  instagram: 'https://www.instagram.com/fusixtech/',
  linkedin: 'https://www.linkedin.com/company/fusix-tech/',
};

const Contact = () => {
  const [headerData, setHeaderData] = useState<any>(null);
  const [faqsData, setFaqsData] = useState<any[]>([]);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [headerRes, faqsRes, companyInfoRes] = await Promise.all([
          axios.get(`${API_URL}/contact-header`),
          axios.get(`${API_URL}/faqs`),
          axios.get(`${API_URL}/company-info`)
        ]);

        setHeaderData(headerRes.data.data);
        setFaqsData(faqsRes.data?.data || faqsRes.data || []);
        setCompanyInfo(companyInfoRes.data?.data || companyInfoRes.data || null);

      } catch (error) {
        console.error("Error fetching contact data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const finalCompanyInfo = companyInfo || {
    email: COMPANY.email,
    phone: COMPANY.phone,
    phoneRaw: COMPANY.phoneRaw,
    address: COMPANY.addressLines.join(', '),
    addressLines: COMPANY.addressLines,
    mapsLink: COMPANY.mapsLink,
    mapsEmbed: COMPANY.mapsEmbed
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "name": "Contact Fusix Tech",
        "url": "https://fusixtech.com/contact"
      },
      {
        "@type": "Organization",
        "name": "Fusix Tech",
        "url": "https://fusixtech.com",
        "email": COMPANY.email,
        "telephone": COMPANY.phoneRaw,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Rua Fernão de Magalhães, Cerro Alagoa, Apt L11, Lote 20",
          "addressLocality": "Albufeira",
          "postalCode": "8200-129",
          "addressCountry": "PT"
        },
        "sameAs": [
          SOCIALS.facebook,
          SOCIALS.twitter,
          SOCIALS.instagram,
          SOCIALS.linkedin
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqsData.length > 0
          ? faqsData.map((faq: any) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
            }))
          : []
      }
    ]
  };

  if (loading) {
    return (
      <div className="contact-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#fff' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="contact-container">
      <SEO
        title="Contact Us | Get a Free Quote | Fusix Tech"
        description="Contact Fusix Tech for web development, software and IT solutions. Call, email or send us a message and we'll reply within 24 hours."
        path="/contact"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      {/* Hero Section (Data from contact_header) */}
      {headerData && (
        <section className="contact-hero">
          <div className="hero-particles"></div>
          <div className="container">
            <div className="contact-hero-content">
              <span className="hero-subtitle">{headerData.top_tagline}</span>
              <h1 className="hero-title">
                {headerData.main_heading_white_1}{' '}
                <span className="golden-text">{headerData.main_heading_yellow}</span>{' '}
                {headerData.main_heading_white_2}
              </h1>
              <p className="hero-description">
                {headerData.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ✅ Home page wala ContactSection (Form) */}
      <ContactSection 
        companyInfo={finalCompanyInfo} 
        onBookAppointment={() => {}} 
      />

      {/* ✅ Home page wala FaqSection (Data from /api/faqs) */}
      {faqsData.length > 0 && (
        <FaqSection faqs={faqsData} faqImage="" />
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Project?</h2>
            <p>Let's discuss how we can help bring your ideas to life</p>
            <div className="cta-buttons">
              <a href={`tel:${COMPANY.phoneRaw}`} className="btn-primary">
                Schedule a Call <MessageCircle size={18} />
              </a>
              <Link to="/portfolio" className="btn-outline">
                View Portfolio <Globe size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;