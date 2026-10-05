// src/components/demo/HeroScrollDemo.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import axios from 'axios';
import { API_URL, STORAGE_URL } from "../../../config"; // ✅ STORAGE_URL import karo

interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  images: string[];
}

interface LinePosition {
  side: "top" | "right" | "bottom" | "left";
  progress: number;
}

// Placeholder image - fast loading
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="340" viewBox="0 0 600 340"%3E%3Crect width="600" height="340" fill="%231a1a1a"/%3E%3Ctext x="300" y="170" text-anchor="middle" fill="%23666" font-size="14"%3ELoading...%3C/text%3E%3C/svg%3E';

export function HeroScrollDemo() {
  const [selectedProject, setSelectedProject] = useState<number>(0);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [linePosition, setLinePosition] = useState<LinePosition>({ side: "top", progress: 0 });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // ✅ FIXED: Helper function to get image URL - STORAGE_URL use karo
  const getImageUrl = useCallback((url: string | null): string => {
    if (!url) {
      console.log('⚠️ No image URL');
      return PLACEHOLDER_IMAGE;
    }
    
    // Agar already full URL hai (http/https se start)
    if (url.startsWith('http')) {
      return url;
    }
    
    // Clean the path
    let cleanUrl = url;
    
    // Agar /storage/ se start ho raha hai toh hatake STORAGE_URL ke saath jodo
    if (cleanUrl.startsWith('/storage/')) {
      cleanUrl = cleanUrl.replace('/storage/', '');
    }
    // Agar storage/ se start ho raha hai (baghair slash)
    else if (cleanUrl.startsWith('storage/')) {
      cleanUrl = cleanUrl.replace('storage/', '');
    }
    // Agar uploads/ se start ho raha hai
    else if (cleanUrl.startsWith('uploads/')) {
      cleanUrl = cleanUrl;
    }
    
    // Remove any leading slashes
    cleanUrl = cleanUrl.replace(/^\/+/, '');
    
    // ✅ STORAGE_URL use karo, API_URL nahi
    const finalUrl = `${STORAGE_URL}/${cleanUrl}`;
    
    console.log('🖼️ Original URL:', url);
    console.log('🖼️ Final URL:', finalUrl);
    
    return finalUrl;
  }, []);

  // Handle image error
  const handleImageError = useCallback((projectId: number, imageIndex: number) => {
    console.error(`❌ Image error for project ${projectId}, image ${imageIndex}`);
    setImageErrors(prev => ({
      ...prev,
      [`${projectId}-${imageIndex}`]: true
    }));
  }, []);

  // Get image source with error fallback
  const getImageSrc = useCallback((project: Project | undefined, imageIndex: number): string => {
    if (!project) return PLACEHOLDER_IMAGE;
    const errorKey = `${project.id}-${imageIndex}`;
    if (imageErrors[errorKey]) return PLACEHOLDER_IMAGE;
    return project.images?.[imageIndex] || PLACEHOLDER_IMAGE;
  }, [imageErrors]);

  // Fetch portfolio projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        console.log('📡 Fetching projects from:', `${API_URL}/portfolio_projects`);
        
        const response = await axios.get(`${API_URL}/portfolio_projects`);
        
        console.log('📦 Projects Response:', response.data);
        
        // Check response structure
        let projectsData = [];
        if (response.data?.success && Array.isArray(response.data.data)) {
          projectsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          projectsData = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          projectsData = response.data.data;
        }
        
        if (projectsData.length > 0) {
          const formattedProjects: Project[] = projectsData.map((project: any) => ({
            id: project.id,
            title: project.title || 'Project',
            description: project.description || '',
            tech: (() => {
              try {
                if (typeof project.technologies === 'string') {
                  return JSON.parse(project.technologies);
                }
                return Array.isArray(project.technologies) ? project.technologies : [];
              } catch (e) {
                return [];
              }
            })(),
            images: [
              getImageUrl(project.image_1),
              getImageUrl(project.image_2),
              getImageUrl(project.image_3),
            ]
          }));
          setProjects(formattedProjects);
          console.log('✅ Projects loaded:', formattedProjects.length);
        } else {
          console.log('⚠️ No projects found in response');
          setProjects([]);
        }
      } catch (error: any) {
        console.error('❌ Error fetching projects:', error.message);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [getImageUrl]);

  // Moving line animation
  useEffect(() => {
    const sides: ("top" | "right" | "bottom" | "left")[] = ["top", "right", "bottom", "left"];
    let sideIndex = 0;
    let progress = 0;
    
    const interval = setInterval(() => {
      progress += 0.8;
      if (progress >= 100) {
        progress = 0;
        sideIndex = (sideIndex + 1) % sides.length;
      }
      setLinePosition({ side: sides[sideIndex], progress });
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  const currentProject = useMemo(() => projects[selectedProject], [projects, selectedProject]);

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        minHeight: "500px",
        background: "#0A0A0A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "3px solid #222",
          borderTop: "3px solid #FFD700",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
      </div>
    );
  }

  // Don't show anything if no projects
  if (!projects.length) {
    return null;
  }

  const getMovingLineStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      background: "linear-gradient(90deg, #FFD700, #FFA500)",
      filter: "blur(3px)",
      zIndex: 20,
      pointerEvents: "none",
      transition: "all 0.05s linear",
      boxShadow: "0 0 12px #FFD700"
    };
    
    switch(linePosition.side) {
      case "top":
        return { ...baseStyle, top: -3, left: `${linePosition.progress}%`, width: "clamp(40px, 8vw, 60px)", height: "3px", transform: "translateX(-50%)" };
      case "right":
        return { ...baseStyle, top: `${linePosition.progress}%`, right: -3, width: "3px", height: "clamp(40px, 8vw, 60px)", transform: "translateY(-50%)" };
      case "bottom":
        return { ...baseStyle, bottom: -3, left: `${linePosition.progress}%`, width: "clamp(40px, 8vw, 60px)", height: "3px", transform: "translateX(-50%)" };
      case "left":
        return { ...baseStyle, top: `${linePosition.progress}%`, left: -3, width: "3px", height: "clamp(40px, 8vw, 60px)", transform: "translateY(-50%)" };
      default:
        return {};
    }
  };

  const getGlowTrailStyle = (): React.CSSProperties => {
    const baseTrailStyle: React.CSSProperties = {
      position: "absolute",
      background: "linear-gradient(90deg, rgba(255,215,0,0.4), rgba(255,165,0,0.1))",
      filter: "blur(6px)",
      zIndex: 15,
      pointerEvents: "none",
      transition: "all 0.05s linear"
    };
    
    switch(linePosition.side) {
      case "top":
        return { ...baseTrailStyle, top: -3, left: 0, width: `${linePosition.progress}%`, height: "3px" };
      case "right":
        return { ...baseTrailStyle, top: 0, right: -3, height: `${linePosition.progress}%`, width: "3px" };
      case "bottom":
        return { ...baseTrailStyle, bottom: -3, left: 0, width: `${linePosition.progress}%`, height: "3px" };
      case "left":
        return { ...baseTrailStyle, top: 0, left: -3, height: `${linePosition.progress}%`, width: "3px" };
      default:
        return {};
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      background: "#0A0A0A",
      width: "100%",
      margin: 0,
      padding: "clamp(20px, 5vw, 40px) 0"
    }}>
      <ContainerScroll
        titleComponent={
          <div style={{ textAlign: "center", padding: "0 16px" }}>
            <span style={{ 
              fontSize: "clamp(10px, 3vw, 14px)", 
              letterSpacing: "clamp(2px, 1vw, 4px)", 
              color: "#FFD700", 
              display: "block", 
              marginBottom: "clamp(8px, 2vw, 12px)", 
              fontWeight: "600" 
            }}>
              OUR WORK
            </span>
            
            <h1 style={{ 
              fontSize: "clamp(22px, 6vw, 42px)", 
              margin: "clamp(8px, 2vw, 10px) 0", 
              lineHeight: "1.2", 
              fontWeight: "800", 
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              color: "#FFFFFF"
            }}>
              Featured Projects
            </h1>
          </div>
        }
      >
        <div style={{ 
          width: "100%", 
          maxWidth: "1350px",
          margin: "0 auto",
          background: "linear-gradient(135deg, #0f172a, #0a0f1a)", 
          borderRadius: "clamp(12px, 3vw, 24px)", 
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
        }}>
          
          <div style={getGlowTrailStyle()} />
          <div style={getMovingLineStyle()} />
          
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: "clamp(12px, 3vw, 24px)",
            border: "1px solid rgba(255, 215, 0, 0.15)",
            pointerEvents: "none",
            zIndex: 10
          }} />
          
          <div style={{ 
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            overflow: "hidden"
          }}>
            
            {/* Left side - Projects List */}
            <div style={{ 
              width: isMobile ? "100%" : (isTablet ? "280px" : "340px"),
              padding: isMobile ? "clamp(12px, 4vw, 16px)" : "clamp(16px, 4vw, 28px)", 
              borderRight: isMobile ? "none" : "1px solid rgba(234, 179, 8, 0.1)",
              borderBottom: isMobile ? "1px solid rgba(234, 179, 8, 0.1)" : "none",
              background: "rgba(15, 23, 42, 0.5)",
              overflowY: "auto",
              maxHeight: isMobile ? "auto" : "600px"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "16px"
              }}>
                <h3 style={{ 
                  fontSize: isMobile ? "clamp(12px, 3.5vw, 14px)" : "clamp(14px, 3vw, 17px)", 
                  fontWeight: "600", 
                  color: "#FFD700", 
                  margin: 0,
                  paddingBottom: "6px", 
                  borderBottom: "2px solid rgba(234, 179, 8, 0.3)",
                  display: "inline-block"
                }}>
                 RECENT WORK
                </h3>
              </div>
              
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: "clamp(8px, 2vw, 10px)", 
                marginTop: "8px" 
              }}>
                {projects.slice(0, isMobile ? 1 : projects.length).map((project, index) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(index)}
                    onMouseEnter={() => setHoveredProject(index)}
                    onMouseLeave={() => setHoveredProject(null)}
                    style={{
                      padding: isMobile 
                        ? "clamp(8px, 2.5vw, 10px) clamp(10px, 3vw, 12px)" 
                        : "clamp(10px, 2.5vw, 14px) clamp(12px, 3vw, 16px)",
                      borderRadius: "clamp(8px, 2vw, 12px)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      background: selectedProject === index 
                        ? "linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(234, 179, 8, 0.05))" 
                        : hoveredProject === index 
                          ? "rgba(255, 255, 255, 0.08)" 
                          : "transparent",
                      border: selectedProject === index 
                        ? "1px solid rgba(234, 179, 8, 0.4)" 
                        : hoveredProject === index
                          ? "1px solid rgba(234, 179, 8, 0.2)"
                          : "1px solid rgba(255, 255, 255, 0.05)",
                      transform: hoveredProject === index && !isMobile && window.innerWidth >= 768 ? "translateX(5px)" : "translateX(0)"
                    }}
                  >
                    <div style={{
                      display: "inline-flex",
                      fontSize: isMobile ? "clamp(7px, 2vw, 8px)" : "clamp(8px, 2vw, 10px)",
                      fontWeight: "bold",
                      color: "#eab308",
                      background: "rgba(234, 179, 8, 0.15)",
                      padding: isMobile ? "2px 6px" : "2px 8px",
                      borderRadius: "20px",
                      marginBottom: isMobile ? "6px" : "8px"
                    }}>
                      {(index + 1).toString().padStart(2, "0")}
                    </div>
                    
                    <h4 style={{ 
                      fontWeight: "600", 
                      fontSize: isMobile ? "clamp(11px, 3vw, 13px)" : "clamp(13px, 3vw, 16px)", 
                      color: selectedProject === index ? "#fbbf24" : "#FFFFFF", 
                      margin: 0, 
                      marginBottom: isMobile ? "4px" : "6px"
                    }}>
                      {project.title}
                    </h4>
                    
                    <p style={{ 
                      color: "#94a3b8", 
                      fontSize: isMobile ? "clamp(9px, 2.5vw, 10px)" : "clamp(10px, 2.5vw, 12px)", 
                      margin: 0, 
                      lineHeight: "1.4",
                      marginBottom: isMobile ? "6px" : "8px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}>
                      {project.description}
                    </p>
                    
                    <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? "3px" : "5px" }}>
                      {Array.isArray(project.tech) && project.tech.slice(0, isMobile ? 2 : 3).map((techItem, idx) => (
                        <span key={idx} style={{ 
                          fontSize: isMobile ? "clamp(7px, 2vw, 8px)" : "clamp(8px, 2vw, 10px)", 
                          color: "#eab308", 
                          background: "rgba(234, 179, 8, 0.12)", 
                          padding: isMobile ? "2px 6px" : "2px 8px", 
                          borderRadius: "20px"
                        }}>
                          {techItem}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Images Gallery */}
            <div style={{ 
              flex: 1,
              padding: isMobile ? "clamp(10px, 3vw, 16px)" : "clamp(12px, 3vw, 20px)", 
              background: "rgba(10, 15, 26, 0.3)",
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? "clamp(6px, 2vw, 8px)" : "clamp(8px, 2vw, 12px)"
            }}>
              <div style={{ 
                borderRadius: isMobile ? "clamp(8px, 2vw, 10px)" : "clamp(10px, 2.5vw, 14px)", 
                overflow: "hidden",
                width: "100%",
                aspectRatio: "16/9",
                background: "#1a1a1a"
              }}>
                <img
                  src={getImageSrc(currentProject, 0)}
                  alt={currentProject?.title}
                  style={{ 
                    width: "100%", 
                    height: "100%",
                    objectFit: "cover", 
                    display: "block"
                  }}
                  onError={() => currentProject && handleImageError(currentProject.id, 0)}
                  loading="lazy"
                />
              </div>
              
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr", 
                gap: isMobile ? "clamp(6px, 2vw, 8px)" : "clamp(8px, 2vw, 12px)"
              }}>
                <div style={{ 
                  borderRadius: isMobile ? "clamp(6px, 2vw, 8px)" : "clamp(8px, 2vw, 12px)", 
                  overflow: "hidden",
                  aspectRatio: "4/3",
                  background: "#1a1a1a"
                }}>
                  <img
                    src={getImageSrc(currentProject, 1)}
                    alt={`${currentProject?.title} - 2`}
                    style={{ 
                      width: "100%", 
                      height: "100%",
                      objectFit: "cover", 
                      display: "block"
                    }}
                    onError={() => currentProject && handleImageError(currentProject.id, 1)}
                    loading="lazy"
                  />
                </div>
                <div style={{ 
                  borderRadius: isMobile ? "clamp(6px, 2vw, 8px)" : "clamp(8px, 2vw, 12px)", 
                  overflow: "hidden",
                  aspectRatio: "4/3",
                  background: "#1a1a1a"
                }}>
                  <img
                    src={getImageSrc(currentProject, 2)}
                    alt={`${currentProject?.title} - 3`}
                    style={{ 
                      width: "100%", 
                      height: "100%",
                      objectFit: "cover", 
                      display: "block"
                    }}
                    onError={() => currentProject && handleImageError(currentProject.id, 2)}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContainerScroll>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}