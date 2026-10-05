// src/pages/Portfolio.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ExternalLink } from 'lucide-react';
import SEO from '../SEO';
import './Portfolio.css';
import { API_URL, STORAGE_URL } from "../../../config";

// const API_URL = 'http://127.0.0.1:8000/api';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  // Helper function to get image URL (admin panel wali same logic, STORAGE_URL ke saath)
  const getImageUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/storage')) return `${STORAGE_URL}${url.replace('/storage', '')}`;
    if (url.startsWith('storage')) return `${STORAGE_URL}/${url}`;
    if (url.startsWith('uploads')) return `${STORAGE_URL}/${url}`;
    return `${STORAGE_URL}/uploads/${url}`;
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        console.log('Fetching portfolio from:', `${API_URL}/portfolio`);
        
        const response = await axios.get(`${API_URL}/portfolio`);
        console.log('Portfolio API Response:', response.data);
        
        // ✅ FIXED: Handle different response structures
        let portfolioData = [];
        
        // Check if response has data property
        if (response.data?.data && Array.isArray(response.data.data)) {
          portfolioData = response.data.data;
          console.log('Found data in response.data.data');
        } 
        // Check if response is directly an array
        else if (Array.isArray(response.data)) {
          portfolioData = response.data;
          console.log('Response is directly an array');
        }
        // Check if response has success and data
        else if (response.data?.success && response.data?.data && Array.isArray(response.data.data)) {
          portfolioData = response.data.data;
          console.log('Found data in response.data.data (with success)');
        }
        
        console.log('Portfolio Data Length:', portfolioData.length);
        
        // Process portfolio data with image URLs
        const processedData = portfolioData.map((item: any) => ({
          id: item.id,
          title: item.title || 'Untitled',
          description: item.description || '',
          category: item.category || 'other',
          project_url: item.project_url || '',
          image_url: getImageUrl(item.image),
          technologies: (() => {
            try {
              if (typeof item.technologies === 'string') {
                return JSON.parse(item.technologies);
              }
              return Array.isArray(item.technologies) ? item.technologies : [];
            } catch (e) {
              return [];
            }
          })()
        }));
        
        console.log('Processed Projects:', processedData.length);
        setPortfolio(processedData);
        
      } catch (error: any) {
        console.error('Error fetching portfolio:', error.message);
        setPortfolio([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPortfolio();
  }, []);

  // Scroll to top (title ab SEO component se aata hai)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Categories from database (unique categories)
  const categories = ['all', ...new Set(portfolio.map((item: any) => item.category).filter(Boolean))];

  const filteredPortfolio = activeFilter === 'all' 
    ? portfolio 
    : portfolio.filter((item: any) => item.category === activeFilter);

  // ✅ SEO - loading screen ke saath bhi render hoga
  const seoTags = (
    <SEO
      title="Portfolio | Our Projects | Fusix Tech"
      description="Browse recent projects delivered by Fusix Tech for clients across different industries."
      path="/portfolio"
    />
  );

  if (loading) {
    return (
      <div className="portfolio-loading" style={{ marginTop: '70px', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0A0A0A' }}>
        {seoTags}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #222',
            borderTop: '3px solid #FFD700',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <p style={{ marginTop: '20px', color: '#666' }}>Loading our work...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-page" style={{ marginTop: '70px', background: '#0A0A0A', minHeight: '100vh' }}>
      {seoTags}

      {/* Hero Section */}
      <section className="portfolio-hero" style={{
        padding: 'clamp(40px, 8vw, 80px) 20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1a1a1a 100%)'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <span className="hero-badge" style={{ 
            fontSize: 'clamp(12px, 3vw, 14px)', 
            color: '#FFD700', 
            letterSpacing: '4px',
            display: 'block',
            marginBottom: '15px',
            fontWeight: '600'
          }}>OUR WORK</span>
          <h1 style={{ 
            fontSize: 'clamp(32px, 8vw, 56px)', 
            marginBottom: '20px',
            color: '#FFFFFF',
            fontWeight: '800'
          }}>
            Our <span style={{ color: '#FFD700' }}>Portfolio</span>
          </h1>
          <p style={{ 
            fontSize: 'clamp(14px, 4vw, 18px)', 
            color: '#aaa',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.5'
          }}>
            Explore our latest projects and success stories
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="portfolio-filters-section" style={{ padding: 'clamp(30px, 5vw, 40px) 20px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {categories.length > 1 && (
            <div className="filters" style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'clamp(10px, 2vw, 15px)',
              flexWrap: 'wrap',
              marginBottom: 'clamp(30px, 5vw, 50px)'
            }}>
              {categories.map((filter: string) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  style={{
                    padding: 'clamp(8px, 2vw, 10px) clamp(20px, 5vw, 28px)',
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    background: activeFilter === filter ? '#FFD700' : 'transparent',
                    border: `1px solid ${activeFilter === filter ? '#FFD700' : 'rgba(255,215,0,0.3)'}`,
                    borderRadius: '40px',
                    cursor: 'pointer',
                    color: activeFilter === filter ? '#000' : '#FFD700',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    textTransform: 'capitalize'
                  }}
                >
                  {filter === 'all' ? 'All Projects' : filter}
                </button>
              ))}
            </div>
          )}

          {/* Projects Grid */}
          <div className="portfolio-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(300px, 40vw, 380px), 1fr))',
            gap: 'clamp(25px, 4vw, 35px)'
          }}>
            {filteredPortfolio.map((project: any) => (
              <div
                key={project.id}
                className="portfolio-card"
                style={{
                  background: '#111111',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid rgba(255,215,0,0.08)',
                  boxShadow: '0 10px 30px -15px rgba(0,0,0,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)';
                  e.currentTarget.style.boxShadow = '0 20px 40px -15px rgba(255,215,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,215,0,0.08)';
                  e.currentTarget.style.boxShadow = '0 10px 30px -15px rgba(0,0,0,0.3)';
                }}
              >
                {/* VERTICAL SCROLLABLE IMAGE CONTAINER */}
                <div 
                  className="image-scroll-container"
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 'clamp(250px, 35vw, 320px)',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#FFD700 #333',
                    cursor: 'grab'
                  }}
                >
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: 'auto',
                        minHeight: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      onError={(e) => {
                        console.error('Image failed to load:', project.image_url);
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"%3E%3Crect width="400" height="600" fill="%231a1a1a"/%3E%3Ctext x="200" y="300" text-anchor="middle" fill="%23666" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#1a1a1a',
                      color: '#666',
                      fontSize: '14px'
                    }}>
                      No Image Available
                    </div>
                  )}
                </div>
                
                {/* Card Content */}
                <div style={{ padding: 'clamp(18px, 4vw, 24px)' }}>
                  <h3 style={{ 
                    fontSize: 'clamp(18px, 4vw, 22px)', 
                    marginBottom: '12px', 
                    color: '#FFFFFF', 
                    fontWeight: '700',
                    letterSpacing: '-0.3px'
                  }}>
                    {project.title}
                  </h3>
                  
                  {/* Technologies Section */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ 
                        fontSize: '12px', 
                        color: '#FFD700', 
                        fontWeight: '600',
                        display: 'block',
                        marginBottom: '6px'
                      }}>
                        Technologies:
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {project.technologies.slice(0, 5).map((tech: string, techIdx: number) => (
                          <span key={techIdx} style={{
                            fontSize: '11px',
                            color: '#FFD700',
                            background: 'rgba(255,215,0,0.12)',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontWeight: '500'
                          }}>
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 5 && (
                          <span style={{
                            fontSize: '11px',
                            color: '#888',
                            background: 'rgba(255,255,255,0.08)',
                            padding: '4px 12px',
                            borderRadius: '20px'
                          }}>
                            +{project.technologies.length - 5}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <p style={{ 
                    fontSize: 'clamp(13px, 3vw, 14px)', 
                    color: '#aaaaaa', 
                    marginBottom: '20px', 
                    lineHeight: '1.6'
                  }}>
                    {project.description}
                  </p>
                  
                  {/* View Project Button */}
                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 24px',
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        borderRadius: '40px',
                        color: '#000',
                        textDecoration: 'none',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        fontSize: '13px',
                        marginTop: '5px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 5px 20px rgba(255,215,0,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      View Project <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredPortfolio.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#aaa' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.5 }}>📁</div>
              <p style={{ fontSize: '18px' }}>No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .portfolio-page::-webkit-scrollbar {
          width: 8px;
        }
        .portfolio-page::-webkit-scrollbar-track {
          background: #111;
        }
        .portfolio-page::-webkit-scrollbar-thumb {
          background: #FFD700;
          border-radius: 4px;
        }
        
        /* Vertical scroll container styles */
        .image-scroll-container::-webkit-scrollbar {
          width: 6px;
        }
        .image-scroll-container::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 3px;
        }
        .image-scroll-container::-webkit-scrollbar-thumb {
          background: #FFD700;
          border-radius: 3px;
        }
        
        /* Smooth hover effects */
        .portfolio-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .portfolio-grid {
            gap: 20px !important;
          }
          .image-scroll-container {
            height: 200px !important;
          }
        }
        
        /* Grab cursor for scrollable areas */
        .image-scroll-container:active {
          cursor: grabbing;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;