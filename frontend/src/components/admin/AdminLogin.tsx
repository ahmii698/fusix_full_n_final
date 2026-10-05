// src/components/admin/AdminLogin.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from '../../../config';

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [characterState, setCharacterState] = useState<"idle" | "watching" | "wrong" | "success">("idle");
  const navigate = useNavigate();

  const getCharacterEmoji = () => {
    switch(characterState) {
      case "watching": return "🧐";
      case "wrong": return "😤";
      case "success": return "😎";
      default: return "🤵";
    }
  };

  const getCharacterMessage = () => {
    switch(characterState) {
      case "watching": return "🔍 Checking credentials...";
      case "wrong": return "❌ Access Denied!";
      case "success": return "✅ Welcome back, Admin!";
      default: return "👋 Please sign in to continue";
    }
  };

  const getCharacterPose = () => {
    if (characterState === "watching") {
      return {
        transform: "scale(1.1)",
        filter: "brightness(1.2)"
      };
    }
    return {};
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCharacterState("watching");

    try {
      const response = await fetch(`${API_URL}/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);
      
      if (data.success) {
        setCharacterState("success");
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      } else {
        setCharacterState("wrong");
        setError(data.message || "Invalid credentials");
        
        setTimeout(() => {
          setCharacterState("idle");
        }, 2000);
      }
    } catch (err) {
      console.error("Login error:", err);
      setCharacterState("wrong");
      setError("Connection failed. Please try again.");
      
      setTimeout(() => {
        setCharacterState("idle");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value.length > 0) {
      setCharacterState("watching");
    } else {
      setCharacterState("idle");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(145deg, #1a1e2b 0%, #2d3349 100%)",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      padding: "20px",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundImage: `
          linear-gradient(rgba(100, 116, 139, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(100, 116, 139, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
        animation: "gridMove 20s linear infinite",
        zIndex: 1
      }} />

      <div style={{
        background: "rgba(255, 255, 255, 0.98)",
        padding: "45px",
        borderRadius: "32px",
        boxShadow: "0 30px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        width: "100%",
        maxWidth: "440px",
        position: "relative",
        zIndex: 2,
        backdropFilter: "blur(10px)",
        animation: "fadeIn 0.6s ease"
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "30px",
          position: "relative"
        }}>
          <div style={{
            width: "120px",
            height: "120px",
            margin: "0 auto 20px",
            position: "relative",
            animation: characterState === "wrong" ? "shake 0.5s ease" : 
                       characterState === "success" ? "bounce 0.5s ease" : "float 3s ease-in-out infinite"
          }}>
            <div style={{
              position: "absolute",
              top: "-10px",
              left: "-10px",
              right: "-10px",
              bottom: "-10px",
              background: characterState === "success" 
                ? "radial-gradient(circle, rgba(52, 211, 153, 0.3) 0%, transparent 70%)"
                : characterState === "wrong"
                ? "radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, transparent 70%)",
              borderRadius: "50%",
              animation: "pulse 2s ease-in-out infinite",
              zIndex: -1
            }} />

            <div style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(145deg, #2d3349, #1a1e2b)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "58px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1)",
              border: "3px solid rgba(255, 255, 255, 0.1)",
              transition: "all 0.3s ease",
              ...getCharacterPose()
            }}>
              {getCharacterEmoji()}
            </div>

            <svg style={{ position: "absolute", top: -5, left: -5, width: 130, height: 130 }}>
              <circle
                cx="60"
                cy="60"
                r="58"
                fill="none"
                stroke={characterState === "success" ? "#34d399" : characterState === "wrong" ? "#ef4444" : "#4f46e5"}
                strokeWidth="3"
                strokeDasharray="360"
                strokeDashoffset={characterState === "watching" ? "270" : "0"}
                style={{
                  transition: "stroke-dashoffset 1s ease, stroke 0.3s ease",
                  transform: "rotate(-90deg)",
                  transformOrigin: "center",
                  opacity: 0.3
                }}
              />
            </svg>
          </div>

          <div style={{
            background: "linear-gradient(145deg, #f8fafc, #f1f5f9)",
            padding: "16px 24px",
            borderRadius: "60px",
            display: "inline-block",
            position: "relative",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{
              position: "absolute",
              top: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "0",
              height: "0",
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderBottom: "8px solid #f8fafc"
            }} />
            <p style={{
              margin: 0,
              color: characterState === "success" ? "#059669" : 
                     characterState === "wrong" ? "#dc2626" : "#1e293b",
              fontSize: "15px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ fontSize: "18px" }}>
                {characterState === "success" ? "✨" : characterState === "wrong" ? "⚠️" : "🔐"}
              </span>
              {getCharacterMessage()}
            </p>
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: "35px" }}>
          <h2 style={{ 
            margin: 0, 
            color: "#0f172a", 
            fontSize: "32px", 
            fontWeight: "700",
            letterSpacing: "-0.5px"
          }}>
            Welcome Back
          </h2>
          <p style={{ 
            margin: "8px 0 0", 
            color: "#64748b", 
            fontSize: "15px"
          }}>
            Enter your credentials to continue
          </p>
        </div>

        {error && (
          <div style={{
            background: "#fef2f2",
            color: "#dc2626",
            padding: "14px",
            borderRadius: "16px",
            marginBottom: "25px",
            fontSize: "14px",
            textAlign: "center",
            border: "1px solid #fecaca",
            animation: "slideIn 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}>
            <span style={{ fontSize: "18px" }}>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#334155",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 18px",
                border: "2px solid #e2e8f0",
                borderRadius: "16px",
                fontSize: "15px",
                outline: "none",
                transition: "all 0.3s",
                boxSizing: "border-box",
                background: "#ffffff"
              }}
              placeholder="admin@example.com"
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#334155",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              style={{
                width: "100%",
                padding: "14px 18px",
                border: "2px solid #e2e8f0",
                borderRadius: "16px",
                fontSize: "15px",
                outline: "none",
                transition: "all 0.3s",
                boxSizing: "border-box",
                background: "#ffffff"
              }}
              placeholder="••••••••"
            />
          </div>

          <div style={{ 
            textAlign: "right", 
            marginBottom: "20px" 
          }}>
            <button
              type="button"
              onClick={() => navigate('/forgot')}
              style={{
                background: "none",
                border: "none",
                color: "#4f46e5",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                textDecoration: "underline",
                padding: "5px",
                transition: "color 0.3s"
              }}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: loading ? "#94a3b8" : "linear-gradient(145deg, #4f46e5, #6366f1)",
              color: "white",
              border: "none",
              borderRadius: "16px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.3s",
              marginBottom: "20px",
              boxShadow: "0 10px 20px rgba(79, 70, 229, 0.3)"
            }}
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>

          <div style={{ textAlign: "center" }}>
            <a href="/" style={{
              color: "#64748b",
              fontSize: "14px",
              textDecoration: "none",
              transition: "color 0.3s",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}>
              ← Back to Website
            </a>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes gridMove { 0% { transform: translate(0, 0); } 100% { transform: translate(50px, 50px); } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}