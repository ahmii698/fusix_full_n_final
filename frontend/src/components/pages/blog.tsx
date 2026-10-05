// pages/Blog.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Calendar, Clock, Search, MessageCircle, Eye, Heart,
  ChevronLeft, ChevronRight, X, Award
} from 'lucide-react';
import SEO from '../SEO';
import { API_URL, STORAGE_URL } from '../../../config';
import './Blog.css';

// --- Helper function to get image URL (Portfolio / admin panel wali same logic, STORAGE_URL ke saath) ---
const getImageUrl = (url: string | null) => {
  if (!url) return 'https://via.placeholder.com/600x400?text=No+Image';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/storage')) return `${STORAGE_URL}${url.replace('/storage', '')}`;
  if (url.startsWith('storage')) return `${STORAGE_URL}/${url.replace(/^storage\/?/, '')}`;
  if (url.startsWith('uploads')) return `${STORAGE_URL}/${url}`;
  return `${STORAGE_URL}/uploads/${url}`;
};

// Screen width ke hisaab se ek saath kitne featured cards dikhane hain
const getSlidesPerView = () => {
  if (typeof window === 'undefined') return 3;
  const w = window.innerWidth;
  if (w >= 1024) return 3;
  if (w >= 640) return 2;
  return 1;
};

const Blog = () => {
  // --- States for Dynamic Data ---
  const [headerData, setHeaderData] = useState<any>(null);
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  // --- UI States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [currentFeatured, setCurrentFeatured] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(getSlidesPerView());

  // Slider limits: jitni extra posts hon utne hi steps
  const maxFeaturedIndex = Math.max(0, featuredPosts.length - slidesPerView);
  const canSlide = maxFeaturedIndex > 0;

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Window resize par slidesPerView update karo
  useEffect(() => {
    const handleResize = () => setSlidesPerView(getSlidesPerView());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Agar index limit se bahar chala jaye (resize ya data change par) to wapas theek karo
  useEffect(() => {
    if (currentFeatured > maxFeaturedIndex) {
      setCurrentFeatured(maxFeaturedIndex);
    }
  }, [maxFeaturedIndex, currentFeatured]);

  // --- Fetch Data from Backend ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [headerRes, featuredRes, postsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_URL}/blog-header`),
          axios.get(`${API_URL}/blog-features`),
          axios.get(`${API_URL}/main-blog`),
          axios.get(`${API_URL}/blog-categories`)
        ]);

        setHeaderData(headerRes.data.data);
        setFeaturedPosts(featuredRes.data.data || []);
        setBlogPosts(postsRes.data.data || []);

        // Categories ke sath "All Posts" add karein
        const totalPosts = categoriesRes.data.total || 0;
        const allCategory = { category: 'All Posts', count: totalPosts };
        setCategories([allCategory, ...(categoriesRes.data.data || [])]);

      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Auto-slide featured posts (sirf tab jab posts dikhne wale cards se zyada hon)
  useEffect(() => {
    if (!canSlide) return;
    const interval = setInterval(() => {
      setCurrentFeatured((prev) => (prev >= maxFeaturedIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [canSlide, maxFeaturedIndex]);

  const nextFeatured = () => {
    if (!canSlide) return;
    setCurrentFeatured((prev) => (prev >= maxFeaturedIndex ? 0 : prev + 1));
  };

  const prevFeatured = () => {
    if (!canSlide) return;
    setCurrentFeatured((prev) => (prev <= 0 ? maxFeaturedIndex : prev - 1));
  };

  // Filter posts (category + search)
  const filteredPosts = blogPosts.filter((post) => {
    const q = searchQuery.toLowerCase();
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch =
      q === '' ||
      post.title.toLowerCase().includes(q) ||
      (post.description && post.description.toLowerCase().includes(q)) ||
      (post.tags && post.tags.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const postsPerPage = 4;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // Structured data (SEO)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Fusix Tech Blog",
    "url": "https://fusixtech.com/blog",
    "description": "Insights on web development, mobile apps, cloud, AI and cybersecurity from the Fusix Tech team.",
    "publisher": {
      "@type": "Organization",
      "name": "Fusix Tech",
      "url": "https://fusixtech.com"
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="blog-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#fff' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <SEO
        title="Blog | Web, Mobile, Cloud & AI Insights | Fusix Tech"
        description="Read expert articles from Fusix Tech on web development, mobile apps, cloud computing, AI and cybersecurity."
        path="/blog"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      {/* Hero Section (Dynamic from blog_header) */}
      {headerData && (
        <section className="blog-hero">
          <div className="hero-particles"></div>
          <div className="container">
            <div className="blog-hero-content">
              <span className="hero-subtitle">{headerData.top_tagline}</span>
              <h1 className="hero-title">
                {headerData.main_heading_white}{' '}
                <span className="golden-text">{headerData.main_heading_yellow}</span>
              </h1>
              <p className="hero-description">
                {headerData.sub_description}
              </p>

              <div className="hero-search">
                <div className={`search-wrapper ${showSearch ? 'expanded' : ''}`}>
                  <input
                    type="text"
                    placeholder={headerData.search_placeholder || "Search articles..."}
                    aria-label="Search articles"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="search-input"
                  />
                  <button
                    className="search-btn"
                    aria-label={showSearch ? 'Close search' : 'Open search'}
                    onClick={() => setShowSearch(!showSearch)}
                  >
                    {showSearch ? <X size={20} /> : <Search size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Posts Slider (Dynamic from blog_features) */}
      {searchQuery === '' && selectedCategory === 'all' && featuredPosts.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <div className="featured-header">
              <h2 className="featured-title">
                <Award size={24} />
                {featuredPosts[0]?.heading_white || 'Featured'}{' '}
                <span className="golden-text">{featuredPosts[0]?.heading_yellow || 'Posts'}</span>
              </h2>

              {/* Arrows sirf tab dikhao jab slide karne ke liye extra posts hon */}
              {canSlide && (
                <div className="featured-controls">
                  <button
                    className="featured-control prev"
                    aria-label="Previous post"
                    onClick={prevFeatured}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    className="featured-control next"
                    aria-label="Next post"
                    onClick={nextFeatured}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>

            <div className="featured-slider-container">
              <div
                className="featured-slider-track"
                style={{
                  transform: `translateX(-${currentFeatured * (100 / slidesPerView)}%)`
                }}
              >
                {featuredPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="featured-slide"
                    style={{
                      flex: `0 0 ${100 / slidesPerView}%`,
                      maxWidth: `${100 / slidesPerView}%`,
                      boxSizing: 'border-box'
                    }}
                  >
                    <div className="featured-card">
                      <div className="featured-card-image">
                        <img
                          src={getImageUrl(post.image)}
                          alt={post.title}
                          width={600}
                          height={400}
                          loading={index === 0 ? 'eager' : 'lazy'}
                        />
                        <span className="featured-category">{post.category}</span>
                      </div>
                      <div className="featured-card-content">
                        <div className="featured-meta">
                          <span className="featured-date">
                            <Calendar size={14} />
                            {post.post_date}
                          </span>
                          <span className="featured-read-time">
                            <Clock size={14} />
                            {post.read_time}
                          </span>
                        </div>
                        <h3 className="featured-card-title">{post.title}</h3>
                        <p className="featured-card-excerpt">{post.description}</p>
                        <div className="featured-card-footer">
                          <div className="featured-author">
                            <div className="author-avatar-initial" style={{
                              width: 40, height: 40, borderRadius: '50%',
                              background: '#FFD700', color: '#0A0A0A',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 700, fontSize: 14
                            }}>
                              {post.author_initial}
                            </div>
                            <div>
                              <h4>{post.author_name}</h4>
                              <p>{post.author_role}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots sirf tab dikhao jab slide ho sakta ho */}
            {canSlide && (
              <div className="featured-dots">
                {Array.from({ length: maxFeaturedIndex + 1 }).map((_, index) => (
                  <button
                    key={index}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`dot ${index === currentFeatured ? 'active' : ''}`}
                    onClick={() => setCurrentFeatured(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Blog Content Section */}
      <section className="blog-content-section">
        <div className="container">
          <div className="blog-layout">
            {/* Sidebar (Categories from /blog-categories) */}
            <aside className="blog-sidebar">
              <div className="sidebar-widget">
                <h2 className="widget-title">Categories</h2>
                <ul className="category-list">
                  {categories.map((category, index) => {
                    const isAll = category.category === 'All Posts';
                    const isActive = (isAll && selectedCategory === 'all') || (!isAll && selectedCategory === category.category);

                    return (
                      <li key={index}>
                        <button
                          className={`category-btn ${isActive ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedCategory(isAll ? 'all' : category.category);
                            setCurrentPage(1);
                          }}
                        >
                          <span>{category.category}</span>
                          <span className="category-count">{category.count}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            {/* Blog Posts Grid (Dynamic from main_blog) */}
            <div className="blog-posts">
              {currentPosts.length > 0 ? (
                <>
                  <div className="posts-grid">
                    {currentPosts.map((post) => (
                      <article key={post.id} className="blog-post-card">
                        <div className="post-image">
                          <img
                            src={getImageUrl(post.image)}
                            alt={post.title}
                            width={600}
                            height={400}
                            loading="lazy"
                          />
                          <div className="post-category">{post.category}</div>
                        </div>
                        <div className="post-content">
                          <div className="post-meta">
                            <span className="post-date">
                              <Calendar size={14} />
                              {post.post_date}
                            </span>
                            <span className="post-read-time">
                              <Clock size={14} />
                              {post.read_time}
                            </span>
                          </div>
                          <h3 className="post-title">{post.title}</h3>
                          <p className="post-excerpt">{post.description}</p>

                          <div className="post-footer">
                            <div className="post-author">
                              <div className="author-avatar-initial" style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: '#FFD700', color: '#0A0A0A',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: 12
                              }}>
                                {post.author_initial}
                              </div>
                              <span>{post.author_name}</span>
                            </div>
                            <div className="post-stats">
                              <span title="Views">
                                <Eye size={14} />
                                {post.views}
                              </span>
                              <span title="Likes">
                                <Heart size={14} />
                                {post.likes}
                              </span>
                              <span title="Comments">
                                <MessageCircle size={14} />
                                {post.comments}
                              </span>
                            </div>
                          </div>

                          {post.tags && (
                            <div className="post-tags">
                              {post.tags.split(',').map((tag: string, i: number) => (
                                <span key={i} className="tag">#{tag.trim()}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <nav className="pagination" aria-label="Blog pagination">
                      <button
                        className="pagination-btn"
                        aria-label="Previous page"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft size={18} />
                      </button>

                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        className="pagination-btn"
                        aria-label="Next page"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </nav>
                  )}
                </>
              ) : (
                <div className="no-results">
                  <Search size={48} />
                  <h3>No posts found</h3>
                  <p>Try adjusting your search or filter to find what you're looking for.</p>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setCurrentPage(1);
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section (Same as other pages) */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Work With the Best?</h2>
            <p>Let's discuss how we can help transform your business</p>
            <Link to="/contact" className="btn-primary">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;