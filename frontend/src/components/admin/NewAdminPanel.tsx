import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { 
  FiImage, FiBookOpen, FiHome, FiMail, FiMessageSquare, FiHelpCircle, 
  FiStar, FiImage as FiHeroImage, FiMail as FiNewsletter, FiFileText, 
  FiBriefcase, FiTool, FiDollarSign, FiPieChart, FiSettings, 
  FiCreditCard, FiCalendar, FiTool as FiServices, FiZap,
  FiBarChart2, FiUsers, FiCpu, FiMessageCircle, FiUser,
  FiRefreshCw, FiTrash2, FiEdit2, FiPlus, FiSearch, FiLogOut,
  FiSend, FiX, FiChevronLeft, FiChevronRight,
  FiInfo, FiServer, FiPhone,
  FiTarget, FiLayers,
  FiList, FiCode,
  FiAward, FiEdit3
} from 'react-icons/fi';
import axios from "axios";
import { API_URL, STORAGE_URL } from '../../../config';

// ==================== ALL DATABASE TABLES ====================
const TABLES = [
  { name: "company_info", icon: <FiHome size={18} />, label: "Company Info" },
  { name: "faqs", icon: <FiHelpCircle size={18} />, label: "FAQs" },
  { name: "faq_images", icon: <FiImage size={18} />, label: "FAQ Images" },
  { name: "features", icon: <FiStar size={18} />, label: "Features" },
  { name: "newsletter_subscribers", icon: <FiNewsletter size={18} />, label: "Newsletter" },
  { name: "portfolio", icon: <FiBriefcase size={18} />, label: "Portfolio" },
  { name: "pricing_features", icon: <FiDollarSign size={18} />, label: "Pricing Features" },
  { name: "pricing_plans", icon: <FiPieChart size={18} />, label: "Pricing Plans" },
  { name: "process_steps", icon: <FiSettings size={18} />, label: "Process Steps" },
  { name: "plan_purchases", icon: <FiCreditCard size={18} />, label: "Plan Purchases" },
  { name: "appointments", icon: <FiCalendar size={18} />, label: "Appointments" },
  { name: "services", icon: <FiServices size={18} />, label: "Services" },
  { name: "service_features", icon: <FiZap size={18} />, label: "Service Features" },
  { name: "statistics", icon: <FiBarChart2 size={18} />, label: "Statistics" },
  { name: "team_members", icon: <FiUsers size={18} />, label: "Team Members" },
  { name: "technologies", icon: <FiCpu size={18} />, label: "Technologies" },
  { name: "testimonials", icon: <FiMessageCircle size={18} />, label: "Testimonials" },
  { name: "portfolio_projects", icon: <FiBriefcase size={18} />, label: "Portfolio Projects" },
  { name: "users", icon: <FiUser size={18} />, label: "Users" },
  // 🔥 HEADER TABLES
  { name: "about_header", icon: <FiInfo size={18} />, label: "About Header" },
  { name: "service_header", icon: <FiServer size={18} />, label: "Service Header" },
  { name: "contact_header", icon: <FiPhone size={18} />, label: "Contact Header" },
  // 🔥 ABOUT TABLES
  { name: "about_2", icon: <FiBarChart2 size={18} />, label: "About Statics" },
  { name: "about_3_main", icon: <FiBookOpen size={18} />, label: "About Story" },
  { name: "about_4_principles", icon: <FiTarget size={18} />, label: "About Principle" },
  // 🔥 SERVICE TABLES
  { name: "service_3", icon: <FiList size={18} />, label: "Service Process" },
  { name: "technologies", icon: <FiCode size={18} />, label: "Service Technology" },
  // 🔥 BLOG TABLES (NAYE ADD KIYE HAIN) 🔥
  { name: "blog_header", icon: <FiFileText size={18} />, label: "Blog Header" },
  { name: "blog_features", icon: <FiAward size={18} />, label: "Blog Features" },
  { name: "main_blog", icon: <FiEdit3 size={18} />, label: "Blog Posts" }
];

// ==================== MAIN ADMIN PANEL ====================
export default function NewAdminPanel() {
  const [activeTable, setActiveTable] = useState(TABLES[0].name);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      if (width < 768) {
        setSidebarOpen(false);
      } else if (width >= 1024) {
        setSidebarOpen(true);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (!token || !userData) {
      navigate('/admin-login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (e) {
      navigate('/admin-login');
    }
    
    setIsCheckingAuth(false);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin-login');
  };

  if (isCheckingAuth) {
    return (
      <div style={{ 
        background: '#0A0A0A', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #222222',
            borderTop: '3px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <p style={{ marginTop: '20px', color: '#666' }}>Checking authentication...</p>
        </div>
      </div>
    );
  }

  const activeTableData = TABLES.find(t => t.name === activeTable);
  const sidebarWidth = sidebarOpen ? (isMobile ? 240 : (isTablet ? 260 : 280)) : (isMobile ? 60 : (isTablet ? 70 : 80));

  const filteredTables = TABLES.filter(t => 
    t.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: "#0a0a0a",
      overflow: "hidden"
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarWidth,
        background: "#111111",
        color: "#ffffff",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #222222",
        position: "relative",
        zIndex: 50,
        flexShrink: 0
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: sidebarOpen ? (isMobile ? "16px 12px" : (isTablet ? "20px 16px" : "24px 20px")) : (isMobile ? "12px 0" : (isTablet ? "16px 0" : "20px 0")),
          borderBottom: "1px solid #222222",
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarOpen ? "space-between" : "center",
          minHeight: isMobile ? "60px" : (isTablet ? "70px" : "80px")
        }}>
          {sidebarOpen ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "12px" }}>
                <div style={{
                  width: isMobile ? "32px" : (isTablet ? "36px" : "40px"),
                  height: isMobile ? "32px" : (isTablet ? "36px" : "40px"),
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isMobile ? "14px" : (isTablet ? "16px" : "18px"),
                  fontWeight: "700",
                  color: "#ffffff",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
                }}>A</div>
                <div>
                  <span style={{ 
                    fontSize: isMobile ? "13px" : (isTablet ? "15px" : "17px"), 
                    fontWeight: "700", 
                    color: "#ffffff",
                    letterSpacing: "-0.5px"
                  }}>Admin</span>
                  <p style={{ 
                    margin: "2px 0 0", 
                    fontSize: isMobile ? "8px" : (isTablet ? "9px" : "10px"), 
                    color: "#888888", 
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    fontWeight: "600"
                  }}>Dashboard</p>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)} 
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#666666",
                  cursor: "pointer",
                  fontSize: "14px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s"
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/>
                </svg>
              </button>
            </>
          ) : (
            <button 
              onClick={() => setSidebarOpen(true)} 
              style={{
                background: "transparent",
                border: "none",
                color: "#666666",
                cursor: "pointer",
                fontSize: isMobile ? "14px" : "16px",
                width: isMobile ? "36px" : "40px",
                height: isMobile ? "36px" : "40px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s"
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
              </svg>
            </button>
          )}
        </div>

        {/* Search Bar */}
        {sidebarOpen && (
          <div style={{ padding: isMobile ? "12px 12px 8px" : (isTablet ? "16px 16px 10px" : "20px 20px 12px") }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: isMobile ? "8px 10px 8px 32px" : "10px 12px 10px 36px",
                  background: "#1a1a1a",
                  border: "1px solid #222222",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: isMobile ? "11px" : "13px",
                  outline: "none",
                  transition: "all 0.2s",
                  fontWeight: "400"
                }}
              />
              <span style={{ 
                position: "absolute", 
                left: "10px", 
                top: "50%", 
                transform: "translateY(-50%)",
                color: "#555555", 
                fontSize: "12px" 
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </span>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: sidebarOpen ? (isMobile ? "6px 6px" : "8px 12px") : (isMobile ? "4px 4px" : "8px 8px"),
          scrollbarWidth: "thin",
          scrollbarColor: "#333333 transparent"
        }}>
          {sidebarOpen && (
            <div style={{
              fontSize: isMobile ? "8px" : "10px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "#555555",
              margin: isMobile ? "8px 6px 6px" : "16px 8px 12px",
              paddingLeft: "4px"
            }}>
              Modules
            </div>
          )}

          {filteredTables.map((table) => {
            const isActive = activeTable === table.name;
            return (
              <div
                key={table.name}
                onClick={() => setActiveTable(table.name)}
                style={{
                  padding: sidebarOpen ? (isMobile ? "6px 8px" : "10px 14px") : (isMobile ? "8px 0" : "12px 0"),
                  marginBottom: "4px",
                  background: isActive ? "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)" : "transparent",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  color: isActive ? "#667eea" : "#888888",
                  border: isActive ? "1px solid rgba(102, 126, 234, 0.3)" : "1px solid transparent",
                  transition: "all 0.2s ease",
                  position: "relative",
                  overflow: "hidden"
                }}
                title={!sidebarOpen ? table.label : ""}
              >
                {isActive && (
                  <div style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "3px",
                    height: isMobile ? "14px" : "20px",
                    background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "0 3px 3px 0"
                  }}/>
                )}
                
                <span style={{ 
                  fontSize: isMobile ? "14px" : "18px", 
                  marginRight: sidebarOpen ? (isMobile ? "8px" : "12px") : 0,
                  filter: isActive ? "drop-shadow(0 0 8px rgba(102, 126, 234, 0.5))" : "none",
                  transition: "all 0.2s"
                }}>
                  {table.icon}
                </span>
                
                {sidebarOpen && (
                  <span style={{ 
                    flex: 1, 
                    fontSize: isMobile ? "11px" : "13px", 
                    fontWeight: isActive ? "600" : "500",
                    letterSpacing: "-0.2px"
                  }}>
                    {table.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Logout Button */}
        <div style={{ 
          padding: sidebarOpen ? (isMobile ? "12px" : "20px") : (isMobile ? "10px 8px" : "16px 12px"), 
          borderTop: "1px solid #222222",
          background: "#0f0f0f"
        }}>
          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: isMobile ? "8px" : "12px",
              background: "transparent",
              color: "#ff6b6b",
              border: "1px solid #333333",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: isMobile ? "11px" : "13px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s",
              letterSpacing: "-0.2px"
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        background: "#0a0a0a",
        overflow: "hidden",
        position: "relative"
      }}>
        {/* Top Bar */}
        <div style={{
          background: "rgba(17, 17, 17, 0.8)",
          backdropFilter: "blur(20px)",
          padding: isMobile ? "12px 16px" : (isTablet ? "16px 24px" : "20px 32px"),
          borderBottom: "1px solid #222222",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          zIndex: 10,
          flexWrap: "wrap",
          gap: "10px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "10px" : "16px" }}>
            <div style={{
              width: isMobile ? "36px" : (isTablet ? "44px" : "48px"),
              height: isMobile ? "36px" : (isTablet ? "44px" : "48px"),
              background: "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(102, 126, 234, 0.3)",
              fontSize: isMobile ? "18px" : "24px"
            }}>
              {activeTableData?.icon}
            </div>
            <div>
              <h1 style={{ 
                margin: 0,
                fontSize: isMobile ? "18px" : (isTablet ? "22px" : "24px"),
                fontWeight: "700",
                color: "#ffffff",
                letterSpacing: "-0.5px"
              }}>
                {activeTableData?.label}
              </h1>
              <p style={{
                margin: "4px 0 0",
                color: "#666666",
                fontSize: isMobile ? "10px" : "13px",
                fontWeight: "500"
              }}>
                Manage {activeTableData?.label.toLowerCase()} records
              </p>
            </div>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "8px" : "16px",
            padding: isMobile ? "4px 10px" : "8px 16px",
            background: "#1a1a1a",
            borderRadius: "10px",
            border: "1px solid #222222"
          }}>
            <div style={{
              width: isMobile ? "28px" : (isTablet ? "34px" : "36px"),
              height: isMobile ? "28px" : (isTablet ? "34px" : "36px"),
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "10px" : "14px",
              fontWeight: "600",
              color: "#ffffff"
            }}>
              {user?.name?.charAt(0) || 'A'}
            </div>
            {sidebarOpen && !isMobile && (
              <div>
                <div style={{
                  fontSize: isMobile ? "11px" : "14px",
                  fontWeight: "600",
                  color: "#ffffff"
                }}>{user?.name || 'Admin User'}</div>
                <div style={{
                  fontSize: isMobile ? "9px" : "11px",
                  color: "#667eea",
                  fontWeight: "500"
                }}>Super Admin</div>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div style={{ 
          flex: 1, 
          padding: isMobile ? "12px 16px" : (isTablet ? "20px 24px" : "24px 32px"), 
          overflowY: "auto",
          position: "relative",
          zIndex: 5
        }}>
          <DataTable table={activeTable} isMobile={isMobile} isTablet={isTablet} />
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @media (max-width: 768px) {
          .admin-table th, .admin-table td {
            padding: 8px 6px !important;
            font-size: 10px !important;
          }
          .admin-actions {
            gap: 3px !important;
          }
          .admin-actions button {
            padding: 3px 6px !important;
            font-size: 9px !important;
          }
        }
        @media (max-width: 480px) {
          .admin-table th, .admin-table td {
            padding: 6px 4px !important;
            font-size: 9px !important;
          }
          .admin-actions button {
            padding: 2px 4px !important;
            font-size: 8px !important;
          }
          .admin-actions svg {
            width: 10px !important;
            height: 10px !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .admin-table th, .admin-table td {
            padding: 12px 10px !important;
            font-size: 12px !important;
          }
          .admin-actions button {
            padding: 6px 10px !important;
            font-size: 11px !important;
          }
        }
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #111111;
        }
        ::-webkit-scrollbar-thumb {
          background: #333333;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #444444;
        }
      `}</style>
    </div>
  );
}

// ==================== DATA TABLE COMPONENT ====================
const DataTable = ({ table, isMobile, isTablet }: { table: string; isMobile?: boolean; isTablet?: boolean }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingRow, setEditingRow] = useState<any>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newRecord, setNewRecord] = useState<any>({});
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState({ to: '', name: '', subject: '', message: '', type: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const rowsPerPage = 10;

  const getIconPreview = (iconName: string) => {
    if (!iconName) return '❓';
    const iconMap: Record<string, string> = {
      'Globe': '🌐', 'Palette': '🎨', 'Smartphone': '📱', 'Database': '🗄️',
      'Code': '</>', 'PenTool': '✏️', 'Cpu': '⚡', 'TrendingUp': '📈',
      'Rocket': '🚀', 'Shield': '🛡️', 'Users': '👥', 'Star': '⭐',
      'Heart': '❤️', 'Zap': '⚡', 'Cloud': '☁️', 'Clock': '⏰',
      'Target': '🎯', 'Award': '🏆'
    };
    return iconMap[iconName] || '🔷';
  };

  const isImageField = (key: string) => {
    if (key === 'icon_name' || key === 'icon' || key === 'icon_class') {
      return false;
    }
    return key.includes('image') || key.includes('img') || key.includes('photo');
  };

  const isIconField = (key: string) => {
    return key === 'icon_name';
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const result = await response.json();
      console.log('Upload response:', result);
      
      if (result.success) {
        return result.path || result.url;
      }
      return null;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean = false, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    const imageUrl = await uploadImage(file);
    
    if (imageUrl) {
      if (isNew) {
        setNewRecord({ ...newRecord, [field]: imageUrl });
      } else if (editingRow) {
        setEditingRow({ ...editingRow, [field]: imageUrl });
      }
      showMessage("Image uploaded successfully!", "success");
    } else {
      showMessage("Image upload failed!", "error");
    }
    setUploadingImage(false);
  };

  useEffect(() => {
    fetchData();
  }, [table]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/${table}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      const result = await response.json();
      
      console.log(`📥 ${table} API Response:`, result);
      
      let records = [];
      
      if (result.success && result.data) {
        if (Array.isArray(result.data)) {
          records = result.data;
        } else if (typeof result.data === 'object' && result.data !== null) {
          records = [result.data];
        }
      } else if (Array.isArray(result)) {
        records = result;
      }
      
      if (table === 'newsletter_subscribers') {
        records = records.sort((a, b) => {
          const dateA = a.subscribed_at || a.created_at;
          const dateB = b.subscribed_at || b.created_at;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
      }
      
      setData(records);
      
    } catch (error) {
      console.error('Fetch error:', error);
      showMessage("Failed to load data", "error");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${API_URL}/${table}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      showMessage("Record deleted", "success");
      fetchData();
    } catch {
      showMessage("Delete failed", "error");
    }
  };

  const handleApprove = async (id: number) => {
    if (!window.confirm("Approve this testimonial? It will appear on the website.")) return;
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${API_URL}/testimonials/${id}/approve`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      showMessage("Testimonial approved successfully!", "success");
      fetchData();
    } catch {
      showMessage("Approve failed", "error");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    if (!window.confirm(`Delete ${selectedRows.length} records?`)) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await Promise.all(selectedRows.map(id => 
        fetch(`${API_URL}/${table}/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ));
      setSelectedRows([]);
      showMessage(`${selectedRows.length} records deleted`, "success");
      fetchData();
    } catch {
      showMessage("Bulk delete failed", "error");
    }
  };

  const handleUpdate = async () => {
    if (!editingRow) return;
    try {
      const token = localStorage.getItem('adminToken');
      const dataToSend = { ...editingRow };
      delete dataToSend._imageFile;
      delete dataToSend._tempImage;
      
      const response = await fetch(`${API_URL}/${table}/${editingRow.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setEditingRow(null);
        showMessage("Record updated", "success");
        fetchData(); 
      } else {
        showMessage(result.error || "Update failed", "error");
      }
    } catch (error) {
      console.error('Update error:', error);
      showMessage("Update failed", "error");
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/${table}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRecord)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setAddingNew(false);
        setNewRecord({});
        showMessage("Record created", "success");
        fetchData();
      } else {
        showMessage(result.error || "Create failed", "error");
      }
    } catch {
      showMessage("Create failed", "error");
    }
  };

  const handleEmailReply = (row: any, type: 'plan' | 'appointment') => {
    let email = '';
    let name = '';
    let subject = '';
    let message = '';
    
    if (type === 'plan') {
      email = row.email || row.customer_email;
      name = row.name || row.full_name;
      subject = `Re: ${row.plan_name || 'Plan'} Purchase Inquiry - ${name}`;
      message = `Dear ${name},\n\nThank you for your interest in our ${row.plan_name || 'plan'} plan.\n\n`;
    } else if (type === 'appointment') {
      email = row.email || row.customer_email;
      name = row.full_name || row.name || row.customer_name;
      subject = `Re: Your Appointment on ${row.appointment_date || ''} - ${name}`;
      message = `Dear ${name},\n\nThank you for scheduling an appointment with us on ${row.appointment_date} at ${row.appointment_time || 'your preferred time'}.\n\n`;
    }
    
    setSelectedEmail({ to: email, name, subject, message, type });
    setShowEmailModal(true);
  };

  const handleSendEmail = async (emailData: any) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: emailData.to,
          subject: emailData.subject,
          message: emailData.message,
          name: emailData.name
        })
      });

      const result = await response.json();

      if (result.success) {
        showMessage("Email sent successfully!", "success");
        setShowEmailModal(false);
      } else {
        showMessage(result.error || "Failed to send email", "error");
      }
    } catch (error) {
      showMessage("Network error", "error");
    }
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const formatLabel = (key: string) => {
    return key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const toggleRowSelection = (id: number) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(row => row.id));
    }
  };

  const hasEmailField = (row: any) => {
    const allowEmailForTables = ['plan_purchases', 'appointments'];
    
    if (allowEmailForTables.includes(table)) {
      return row.email || row.customer_email;
    }
    
    return false;
  };

  const isPendingTestimonial = (row: any) => {
    return table === 'testimonials' && row.is_approved === 0;
  };

 const getImageUrl = (url: string) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/storage')) return `${STORAGE_URL}${url.replace('/storage', '')}`;
  if (url.startsWith('storage')) return `${STORAGE_URL}/${url}`;
  return `${STORAGE_URL}/uploads/${url}`;
};

  const getVisibleColumns = () => {
    if (!data[0]) return [];
    const keys = Object.keys(data[0]);
    if (isMobile) {
      return keys.slice(0, 3);
    }
    if (isTablet) {
      return keys.slice(0, 5);
    }
    return keys.slice(0, 7);
  };

  const availableIcons = [
    'Globe', 'Palette', 'Smartphone', 'Database', 'Code', 'PenTool', 'Cpu', 
    'TrendingUp', 'Rocket', 'Shield', 'Users', 'Star', 'Heart', 'Zap', 
    'Cloud', 'Clock', 'Target', 'Award'
  ];

  return (
    <div style={{ 
      background: "#111111", 
      borderRadius: "16px", 
      border: "1px solid #222222",
      overflow: "hidden",
      boxShadow: "0 4px 24px rgba(0,0,0,0.4)"
    }}>
      {/* Toast Message */}
      {message && (
        <div style={{
          position: "fixed", 
          top: "24px", 
          right: "24px", 
          padding: isMobile ? "10px 18px" : "14px 24px",
          background: message.type === 'success' 
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
            : "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
          color: "#ffffff",
          borderRadius: "12px", 
          zIndex: 1000,
          fontSize: isMobile ? "12px" : "14px", 
          fontWeight: "600",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          animation: "slideIn 0.3s ease"
        }}>
          {message.text}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ 
        padding: isMobile ? "12px" : (isTablet ? "16px" : "24px"), 
        borderBottom: "1px solid #222222",
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
        background: "#0f0f0f"
      }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: isMobile ? "6px 10px 6px 32px" : "10px 14px 10px 40px",
                background: "#1a1a1a",
                border: "1px solid #333333",
                borderRadius: "8px",
                width: isMobile ? "140px" : (isTablet ? "200px" : "260px"),
                fontSize: isMobile ? "11px" : "14px",
                color: "#ffffff",
                outline: "none"
              }}
            />
            <span style={{ 
              position: "absolute", 
              left: "10px", 
              top: "50%", 
              transform: "translateY(-50%)",
              color: "#555555", 
              fontSize: "12px" 
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </span>
          </div>

          {selectedRows.length > 0 && (
            <button
              onClick={handleBulkDelete}
              style={{
                padding: isMobile ? "6px 10px" : "10px 16px",
                background: "rgba(255, 107, 107, 0.1)",
                color: "#ff6b6b",
                border: "1px solid rgba(255, 107, 107, 0.3)",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: isMobile ? "10px" : "13px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              {!isMobile && `Delete (${selectedRows.length})`}
              {isMobile && `${selectedRows.length}`}
            </button>
          )}

          <button 
            onClick={fetchData}
            style={{
              padding: isMobile ? "6px 10px" : "10px 16px",
              background: "#1a1a1a",
              border: "1px solid #333333",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: isMobile ? "10px" : "13px",
              color: "#888888",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            {!isMobile && "Refresh"}
          </button>
        </div>

        <button
          onClick={() => {
            setAddingNew(true);
            if (data[0]) {
              const empty: any = {};
              Object.keys(data[0]).forEach(key => {
                if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
                  empty[key] = '';
                }
              });
              setNewRecord(empty);
            }
          }}
          style={{
            padding: isMobile ? "6px 12px" : "10px 24px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: isMobile ? "11px" : "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          {!isMobile && "Add New"}
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", padding: "0" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{
              display: "inline-block",
              width: "32px",
              height: "32px",
              border: "3px solid #222222",
              borderTop: "3px solid #667eea",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            <p style={{ marginTop: "16px", color: "#666666", fontSize: "12px" }}>Loading...</p>
          </div>
        ) : (
          <>
            {paginatedData.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#555555" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px", opacity: 0.3 }}>📭</div>
                <p style={{ color: "#888888", fontSize: "13px" }}>No records found</p>
              </div>
            ) : (
              <>
                <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#0a0a0a" }}>
                      <th style={{ padding: isMobile ? "8px" : "12px", width: "32px", borderBottom: "1px solid #222222" }}>
                        <input
                          type="checkbox"
                          checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                          onChange={toggleAllRows}
                          style={{ width: "14px", height: "14px", cursor: "pointer", accentColor: "#667eea" }}
                        />
                      </th>
                      {getVisibleColumns().map(key => (
                        <th key={key} style={{ 
                          padding: isMobile ? "8px 6px" : (isTablet ? "12px 10px" : "14px 12px"), 
                          textAlign: "left", 
                          fontWeight: "600", 
                          color: "#888888",
                          fontSize: isMobile ? "9px" : (isTablet ? "10px" : "11px"),
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          borderBottom: "1px solid #222222",
                          whiteSpace: "nowrap"
                        }}>
                          {formatLabel(key)}
                        </th>
                      ))}
                      <th style={{ 
                        padding: isMobile ? "8px" : "12px", 
                        textAlign: "center", 
                        width: isMobile ? "100px" : (isTablet ? "140px" : "160px"),
                        borderBottom: "1px solid #222222"
                      }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row) => (
                      <tr key={row.id} style={{ 
                        background: selectedRows.includes(row.id) ? 'rgba(102, 126, 234, 0.08)' : '#111111',
                        transition: "background 0.2s ease"
                      }}>
                        <td style={{ padding: isMobile ? "8px" : "12px", textAlign: "center", borderBottom: "1px solid #1a1a1a" }}>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(row.id)}
                            onChange={() => toggleRowSelection(row.id)}
                            style={{ width: "14px", height: "14px", cursor: "pointer", accentColor: "#667eea" }}
                          />
                        </td>
                        {getVisibleColumns().map((key) => {
                          const val = row[key];
                          const isImage = isImageField(key);
                          const isIcon = isIconField(key);
                          
                          return (
                            <td key={key} style={{ 
                              padding: isMobile ? "8px 6px" : (isTablet ? "12px 10px" : "14px 12px"), 
                              color: "#e0e0e0", 
                              fontSize: isMobile ? "10px" : (isTablet ? "12px" : "13px"),
                              fontWeight: "400",
                              borderBottom: "1px solid #1a1a1a",
                              maxWidth: isMobile ? "80px" : (isTablet ? "120px" : "160px"),
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap"
                            }}>
                              {isImage && val ? (
                                <img 
                                  src={getImageUrl(val)} 
                                  alt={key}
                                  style={{
                                    width: isMobile ? "24px" : (isTablet ? "30px" : "32px"),
                                    height: isMobile ? "24px" : (isTablet ? "30px" : "32px"),
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                    border: "1px solid #333333"
                                  }}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ) : isIcon ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span style={{ fontSize: "16px" }}>{getIconPreview(val)}</span>
                                  <span style={{ fontSize: "11px", color: "#aaa" }}>{val || '-'}</span>
                                </div>
                              ) : (
                                <span title={String(val)}>
                                  {val !== null && val !== undefined ? String(val).substring(0, isMobile ? 20 : 30) : '-'}
                                  {String(val).length > (isMobile ? 20 : 30) && '...'}
                                </span>
                              )}
                            </td>
                          );
                        })}
                        <td style={{ padding: isMobile ? "8px" : "12px", textAlign: "center", borderBottom: "1px solid #1a1a1a" }}>
                          <div className="admin-actions" style={{ display: "flex", gap: isMobile ? "3px" : "6px", justifyContent: "center", flexWrap: "wrap" }}>
                            {isPendingTestimonial(row) && (
                              <button
                                onClick={() => handleApprove(row.id)}
                                style={{
                                  padding: isMobile ? "3px 6px" : "6px 10px",
                                  background: "rgba(34, 197, 94, 0.15)",
                                  color: "#22c55e",
                                  border: "1px solid rgba(34, 197, 94, 0.3)",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontSize: isMobile ? "8px" : "11px",
                                  fontWeight: "600"
                                }}
                              >
                                ✓
                              </button>
                            )}
                            
                            {hasEmailField(row) && (
                              <button
                                onClick={() => handleEmailReply(row, table === 'plan_purchases' ? 'plan' : 'appointment')}
                                style={{
                                  padding: isMobile ? "3px 6px" : "6px 10px",
                                  background: "rgba(102, 126, 234, 0.15)",
                                  color: "#667eea",
                                  border: "1px solid rgba(102, 126, 234, 0.3)",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontSize: isMobile ? "8px" : "11px"
                                }}
                              >
                                ✉
                              </button>
                            )}
                            
                            <button
                              onClick={() => setEditingRow(row)}
                              style={{
                                padding: isMobile ? "3px 6px" : "6px 10px",
                                background: "#1a1a1a",
                                color: "#888888",
                                border: "1px solid #333333",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: isMobile ? "8px" : "11px"
                              }}
                            >
                              ✎
                            </button>
                            
                            <button
                              onClick={() => handleDelete(row.id)}
                              style={{
                                padding: isMobile ? "3px 6px" : "6px 10px",
                                background: "transparent",
                                color: "#ff6b6b",
                                border: "1px solid rgba(255, 107, 107, 0.3)",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: isMobile ? "8px" : "11px"
                              }}
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "4px",
                    padding: isMobile ? "12px" : "20px",
                    borderTop: "1px solid #222222",
                    background: "#0f0f0f",
                    flexWrap: "wrap"
                  }}>
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={{
                        padding: isMobile ? "4px 8px" : "8px 14px",
                        background: currentPage === 1 ? "#1a1a1a" : "#222222",
                        border: "1px solid #333333",
                        borderRadius: "6px",
                        cursor: currentPage === 1 ? "not-allowed" : "pointer",
                        color: currentPage === 1 ? "#555555" : "#ffffff",
                        fontSize: isMobile ? "10px" : "12px"
                      }}
                    >
                      ◀
                    </button>
                    
                    <div style={{ display: "flex", gap: "3px", flexWrap: "wrap", justifyContent: "center" }}>
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            style={{
                              minWidth: isMobile ? "28px" : "36px",
                              height: isMobile ? "28px" : "36px",
                              background: currentPage === pageNum 
                                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                                : "#1a1a1a",
                              border: "1px solid " + (currentPage === pageNum ? "transparent" : "#333333"),
                              borderRadius: "6px",
                              cursor: "pointer",
                              color: "#ffffff",
                              fontSize: isMobile ? "10px" : "12px",
                              fontWeight: "600"
                            }}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      style={{
                        padding: isMobile ? "4px 8px" : "8px 14px",
                        background: currentPage === totalPages ? "#1a1a1a" : "#222222",
                        border: "1px solid #333333",
                        borderRadius: "6px",
                        cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                        color: currentPage === totalPages ? "#555555" : "#ffffff",
                        fontSize: isMobile ? "10px" : "12px"
                      }}
                    >
                      ▶
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Email Reply Modal */}
      {showEmailModal && (
        <EmailReplyModal
          email={selectedEmail.to}
          customerName={selectedEmail.name}
          subject={selectedEmail.subject}
          defaultMessage={selectedEmail.message}
          onClose={() => setShowEmailModal(false)}
          onSend={handleSendEmail}
        />
      )}

      {/* Edit Modal */}
      {editingRow && (
        <Modal
          title="Edit Record"
          onClose={() => setEditingRow(null)}
          onSubmit={handleUpdate}
          isMobile={isMobile}
        >
          {Object.keys(editingRow).map(key => {
            if (key === 'id' || key === 'created_at' || key === 'updated_at') return null;
            const isImage = isImageField(key);
            const isIcon = isIconField(key);
            
            return (
              <div key={key} style={{ marginBottom: isMobile ? "12px" : "16px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "4px", 
                  fontSize: isMobile ? "10px" : "12px", 
                  color: "#888888",
                  fontWeight: "600"
                }}>
                  {formatLabel(key)}
                </label>
                
                {isImage ? (
                  <div>
                    {editingRow[key] && (
                      <div style={{ marginBottom: "8px" }}>
                        <img 
                          src={getImageUrl(editingRow[key])} 
                          alt={key}
                          style={{
                            width: isMobile ? "50px" : "60px",
                            height: isMobile ? "50px" : "60px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "2px solid #333333"
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false, key)}
                      style={{
                        width: "100%",
                        padding: "6px",
                        background: "#1a1a1a",
                        border: "1px solid #333333",
                        borderRadius: "6px",
                        color: "#ffffff",
                        fontSize: isMobile ? "10px" : "12px",
                        marginBottom: "6px"
                      }}
                    />
                    <input
                      type="text"
                      value={editingRow[key] || ''}
                      onChange={(e) => setEditingRow({ ...editingRow, [key]: e.target.value })}
                      placeholder="Image URL"
                      style={{
                        width: "100%",
                        padding: isMobile ? "8px 10px" : "10px 12px",
                        background: "#1a1a1a",
                        border: "1px solid #333333",
                        borderRadius: "6px",
                        fontSize: isMobile ? "11px" : "13px",
                        color: "#ffffff",
                        outline: "none"
                      }}
                    />
                  </div>
                ) : isIcon ? (
                  <div>
                    <div style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "40px",
                        height: "40px",
                        background: "#1a1a1a",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #333333",
                        fontSize: "20px"
                      }}>
                        {getIconPreview(editingRow[key])}
                      </div>
                      <span style={{ fontSize: "11px", color: "#666" }}>Icon preview</span>
                    </div>
                    <select
                      value={editingRow[key] || ''}
                      onChange={(e) => setEditingRow({ ...editingRow, [key]: e.target.value })}
                      style={{
                        width: "100%",
                        padding: isMobile ? "8px 10px" : "10px 12px",
                        background: "#1a1a1a",
                        border: "1px solid #333333",
                        borderRadius: "6px",
                        fontSize: isMobile ? "11px" : "13px",
                        color: "#ffffff",
                        outline: "none"
                      }}
                    >
                      <option value="">-- Select Icon --</option>
                      {availableIcons.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                    <p style={{ fontSize: "9px", color: "#555", marginTop: "4px" }}>
                      Select an icon from the dropdown
                    </p>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={editingRow[key] || ''}
                    onChange={(e) => setEditingRow({ ...editingRow, [key]: e.target.value })}
                    style={{
                      width: "100%",
                      padding: isMobile ? "8px 10px" : "10px 12px",
                      background: "#1a1a1a",
                      border: "1px solid #333333",
                      borderRadius: "6px",
                      fontSize: isMobile ? "11px" : "13px",
                      color: "#ffffff",
                      outline: "none"
                    }}
                  />
                )}
              </div>
            );
          })}
        </Modal>
      )}

      {/* Add Modal */}
      {addingNew && (
        <Modal
          title="Add New Record"
          onClose={() => setAddingNew(false)}
          onSubmit={handleCreate}
          isMobile={isMobile}
        >
          {Object.keys(newRecord).map(key => {
            const isImage = isImageField(key);
            const isIcon = isIconField(key);
            
            return (
              <div key={key} style={{ marginBottom: isMobile ? "12px" : "16px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "4px", 
                  fontSize: isMobile ? "10px" : "12px", 
                  color: "#888888",
                  fontWeight: "600"
                }}>
                  {formatLabel(key)}
                </label>
                
                {isImage ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true, key)}
                      style={{
                        width: "100%",
                        padding: "6px",
                        background: "#1a1a1a",
                        border: "1px solid #333333",
                        borderRadius: "6px",
                        color: "#ffffff",
                        fontSize: isMobile ? "10px" : "12px",
                        marginBottom: "6px"
                      }}
                    />
                    <input
                      type="text"
                      value={newRecord[key] || ''}
                      onChange={(e) => setNewRecord({ ...newRecord, [key]: e.target.value })}
                      placeholder="Image URL"
                      style={{
                        width: "100%",
                        padding: isMobile ? "8px 10px" : "10px 12px",
                        background: "#1a1a1a",
                        border: "1px solid #333333",
                        borderRadius: "6px",
                        fontSize: isMobile ? "11px" : "13px",
                        color: "#ffffff",
                        outline: "none"
                      }}
                    />
                  </div>
                ) : isIcon ? (
                  <select
                    value={newRecord[key] || ''}
                    onChange={(e) => setNewRecord({ ...newRecord, [key]: e.target.value })}
                    style={{
                      width: "100%",
                      padding: isMobile ? "8px 10px" : "10px 12px",
                      background: "#1a1a1a",
                      border: "1px solid #333333",
                      borderRadius: "6px",
                      fontSize: isMobile ? "11px" : "13px",
                      color: "#ffffff",
                      outline: "none"
                    }}
                  >
                    <option value="">-- Select Icon --</option>
                    {availableIcons.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={newRecord[key] || ''}
                    onChange={(e) => setNewRecord({ ...newRecord, [key]: e.target.value })}
                    style={{
                      width: "100%",
                      padding: isMobile ? "8px 10px" : "10px 12px",
                      background: "#1a1a1a",
                      border: "1px solid #333333",
                      borderRadius: "6px",
                      fontSize: isMobile ? "11px" : "13px",
                      color: "#ffffff",
                      outline: "none"
                    }}
                  />
                )}
              </div>
            );
          })}
        </Modal>
      )}
    </div>
  );
};

// ==================== EMAIL REPLY MODAL ====================
const EmailReplyModal = ({ email, customerName, subject, defaultMessage, onClose, onSend }: any) => {
  const [emailData, setEmailData] = useState({
    to: email,
    subject: subject,
    message: defaultMessage,
    name: customerName
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    setSending(true);
    await onSend(emailData);
    setSending(false);
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0, 0, 0, 0.8)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 2000,
      backdropFilter: "blur(8px)",
      padding: "16px"
    }} onClick={onClose}>
      <div style={{
        background: "#111111",
        padding: "24px",
        borderRadius: "16px",
        width: "90%",
        maxWidth: "500px",
        maxHeight: "85vh",
        overflowY: "auto",
        border: "1px solid #222222"
      }} onClick={(e) => e.stopPropagation()}>
        
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "20px",
          paddingBottom: "12px",
          borderBottom: "1px solid #222222"
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#ffffff" }}>
              Reply to Email
            </h3>
            <p style={{ margin: "4px 0 0", color: "#666666", fontSize: "12px" }}>
              Sending to {customerName}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: "#1a1a1a",
            border: "1px solid #333333",
            fontSize: "16px",
            cursor: "pointer",
            color: "#888888",
            width: "28px",
            height: "28px",
            borderRadius: "6px"
          }}>✕</button>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "10px", fontWeight: "600", color: "#888888" }}>
            To:
          </label>
          <div style={{
            padding: "10px",
            background: "#0a0a0a",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#ffffff",
            border: "1px solid #222222"
          }}>
            {email}
          </div>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "10px", fontWeight: "600", color: "#888888" }}>
            Subject
          </label>
          <input
            type="text"
            value={emailData.subject}
            onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
            style={{
              width: "100%",
              padding: "10px",
              background: "#1a1a1a",
              border: "1px solid #333333",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#ffffff",
              outline: "none"
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "10px", fontWeight: "600", color: "#888888" }}>
            Message
          </label>
          <textarea
            rows={5}
            value={emailData.message}
            onChange={(e) => setEmailData({...emailData, message: e.target.value})}
            style={{
              width: "100%",
              padding: "10px",
              background: "#1a1a1a",
              border: "1px solid #333333",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#ffffff",
              outline: "none",
              resize: "vertical"
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button onClick={onClose} style={{
            padding: "8px 16px",
            background: "#1a1a1a",
            border: "1px solid #333333",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "12px",
            color: "#888888"
          }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={sending} style={{
            padding: "8px 20px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            cursor: sending ? "not-allowed" : "pointer",
            fontSize: "12px",
            fontWeight: "600",
            opacity: sending ? 0.7 : 1
          }}>
            {sending ? "Sending..." : "Send Reply"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== MODAL COMPONENT ====================
const Modal = ({ title, children, onClose, onSubmit, isMobile }: any) => (
  <div style={{
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0, 0, 0, 0.8)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(8px)",
    padding: "16px"
  }} onClick={onClose}>
    <div style={{
      background: "#111111",
      padding: isMobile ? "16px" : "24px",
      borderRadius: "16px",
      width: "90%",
      maxWidth: "500px",
      maxHeight: "85vh",
      overflowY: "auto",
      border: "1px solid #222222"
    }} onClick={(e) => e.stopPropagation()}>
      <h3 style={{ 
        margin: "0 0 16px", 
        fontSize: isMobile ? "16px" : "20px", 
        fontWeight: "700", 
        color: "#ffffff",
        paddingBottom: "12px",
        borderBottom: "1px solid #222222"
      }}>{title}</h3>
      
      <div style={{ maxHeight: "50vh", overflowY: "auto", paddingRight: "4px" }}>
        {children}
      </div>
      
      <div style={{ 
        marginTop: "20px", 
        display: "flex", 
        justifyContent: "flex-end", 
        gap: "8px",
        paddingTop: "12px",
        borderTop: "1px solid #222222"
      }}>
        <button onClick={onClose} style={{
          padding: isMobile ? "6px 12px" : "8px 16px",
          background: "#1a1a1a",
          border: "1px solid #333333",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: isMobile ? "11px" : "13px",
          color: "#888888"
        }}>
          Cancel
        </button>
        <button onClick={onSubmit} style={{
          padding: isMobile ? "6px 16px" : "8px 20px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: isMobile ? "11px" : "13px",
          fontWeight: "600"
        }}>
          Save
        </button>
      </div>
    </div>
  </div>
);