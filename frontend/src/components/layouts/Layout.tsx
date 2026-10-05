import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import ScrollToTop from "../common/ScrollToTop";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // 🔥 ADMIN PANEL KE LIYE LAYOUT MAT DIKHAO
  const noLayoutPaths = ['/simple-admin', '/admin', '/admin-login', '/forgot'];
  
  if (noLayoutPaths.includes(location.pathname)) {
    return <>{children}</>;
  }

  // ✅ NORMAL PAGES KE LIYE PURA LAYOUT
  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <Header 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        setSidebarOpen={setSidebarOpen}
      />

      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        darkMode={darkMode}
      />

      <div className="mainLayout">
        <main className="content">
          {children}
        </main>
      </div>

      <Footer darkMode={darkMode} />
     
    </div>
  );
};

export default Layout;