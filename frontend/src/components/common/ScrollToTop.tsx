import { useEffect, useState } from "react";
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggle = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;
      
      setScrollProgress(progress);
      
      if (scrolled > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggle);
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  const goTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button 
      className={`scroll-to-top ${visible ? 'visible' : ''}`}
      onClick={goTop}
      aria-label="Scroll to top"
      style={{
        background: `conic-gradient(var(--primary-color) ${scrollProgress}%, transparent ${scrollProgress}% 100%)`
      }}
    >
      <div className="scroll-to-top-inner">
        <ArrowUp size={20} />
      </div>
    </button>
  );
};

export default ScrollToTop;