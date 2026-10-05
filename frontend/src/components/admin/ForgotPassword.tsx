import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from '../../../config';


export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "otp" | "newPassword">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [characterState, setCharacterState] = useState<"idle" | "thinking" | "success" | "error">("idle");
  const navigate = useNavigate();

  // Character animations
  const getCharacterEmoji = () => {
    switch(characterState) {
      case "thinking": return "🤔";
      case "success": return "🎉";
      case "error": return "😕";
      default: return "🔐";
    }
  };

  const getCharacterMessage = () => {
    switch(step) {
      case "email":
        return characterState === "error" ? "Email not found!" : "Enter your email to reset password";
      case "otp":
        return characterState === "error" ? "Invalid OTP!" : "Enter the 6-digit code sent to your email";
      case "newPassword":
        return "Create a new password";
      default:
        return "Password Reset";
    }
  };

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCharacterState("thinking");

    try {
      console.log("📧 Sending email:", email);

      // ✅ LARAVEL API URL - PORT 8000
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📨 Email response:", data);
      
      if (data.success) {
        setCharacterState("success");
        setSuccess("OTP sent to your email!");
        console.log("🔐 YOUR OTP IS:", data.debug_otp);
        setTimeout(() => {
          setStep("otp");
          setCharacterState("idle");
        }, 1500);
      } else {
        setCharacterState("error");
        setError(data.message || "Email not found");
        setTimeout(() => setCharacterState("idle"), 2000);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setCharacterState("error");
      setError("Connection failed. Please try again.");
      setTimeout(() => setCharacterState("idle"), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCharacterState("thinking");

    const otpCode = otp.join("");
    console.log("🔑 Verifying OTP:", otpCode, "for email:", email);
    
    try {
      // ✅ LARAVEL API URL - PORT 8000
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      console.log("📡 OTP response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📨 OTP response:", data);
      
      if (data.success) {
        setCharacterState("success");
        setSuccess("OTP verified successfully!");
        setTimeout(() => {
          setStep("newPassword");
          setCharacterState("idle");
        }, 1500);
      } else {
        setCharacterState("error");
        setError(data.message || "Invalid OTP");
        setTimeout(() => setCharacterState("idle"), 2000);
      }
    } catch (err) {
      console.error("❌ OTP error:", err);
      setCharacterState("error");
      setError("Verification failed");
      setTimeout(() => setCharacterState("idle"), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    setCharacterState("thinking");

    console.log("🔐 Resetting password for:", email);

    try {
      // ✅ LARAVEL API URL - PORT 8000
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: newPassword }),
      });

      console.log("📡 Reset response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📨 Reset response:", data);
      
      if (data.success) {
        setCharacterState("success");
        setSuccess("Password updated successfully!");
        setTimeout(() => {
          navigate('/admin-login');
        }, 2000);
      } else {
        setCharacterState("error");
        setError(data.message || "Failed to reset password");
        setTimeout(() => setCharacterState("idle"), 2000);
      }
    } catch (err) {
      console.error("❌ Reset error:", err);
      setCharacterState("error");
      setError("Connection failed");
      setTimeout(() => setCharacterState("idle"), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle OTP key down (backspace)
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
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
      {/* Background Grid */}
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

      {/* Main Card */}
      <div style={{
        background: "rgba(255, 255, 255, 0.98)",
        padding: "45px",
        borderRadius: "32px",
        boxShadow: "0 30px 60px rgba(0, 0, 0, 0.3)",
        width: "100%",
        maxWidth: "480px",
        position: "relative",
        zIndex: 2
      }}>
        {/* Character Section */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{
            width: "100px",
            height: "100px",
            margin: "0 auto 20px",
            background: "linear-gradient(145deg, #2d3349, #1a1e2b)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "48px",
            border: "3px solid rgba(255,255,255,0.1)",
            animation: characterState === "error" ? "shake 0.5s ease" : 
                      characterState === "success" ? "bounce 0.5s ease" : "float 3s ease-in-out infinite"
          }}>
            {getCharacterEmoji()}
          </div>

          <div style={{
            background: "#f1f5f9",
            padding: "12px 20px",
            borderRadius: "40px",
            display: "inline-block"
          }}>
            <p style={{
              margin: 0,
              color: characterState === "error" ? "#dc2626" : 
                     characterState === "success" ? "#059669" : "#1e293b",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              {getCharacterMessage()}
            </p>
          </div>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2 style={{ 
            margin: 0, 
            color: "#0f172a", 
            fontSize: "28px", 
            fontWeight: "700" 
          }}>
            {step === "email" && "Forgot Password?"}
            {step === "otp" && "Verify OTP"}
            {step === "newPassword" && "Create New Password"}
          </h2>
          <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: "14px" }}>
            {step === "email" && "Don't worry, we'll help you reset it"}
            {step === "otp" && `Code sent to ${email}`}
            {step === "newPassword" && "Choose a strong password"}
          </p>
        </div>

        {/* Error/Success Message */}
        {error && (
          <div style={{
            background: "#fef2f2",
            color: "#dc2626",
            padding: "12px",
            borderRadius: "12px",
            marginBottom: "20px",
            fontSize: "14px",
            textAlign: "center",
            border: "1px solid #fecaca"
          }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{
            background: "#f0fdf4",
            color: "#059669",
            padding: "12px",
            borderRadius: "12px",
            marginBottom: "20px",
            fontSize: "14px",
            textAlign: "center",
            border: "1px solid #bbf7d0"
          }}>
            ✅ {success}
          </div>
        )}

        {/* Email Step */}
        {step === "email" && (
          <form onSubmit={handleEmailSubmit}>
            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#334155", fontWeight: "500" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "2px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#4f46e5";
                  e.target.style.boxShadow = "0 0 0 4px rgba(79, 70, 229, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
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
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                marginBottom: "15px",
                boxShadow: "0 10px 20px rgba(79, 70, 229, 0.3)"
              }}
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <form onSubmit={handleOtpSubmit}>
            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "15px", color: "#334155", textAlign: "center" }}>
                Enter 6-digit code (Check console for OTP)
              </label>
              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    style={{
                      width: "50px",
                      height: "60px",
                      textAlign: "center",
                      fontSize: "24px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "12px",
                      outline: "none",
                      fontWeight: "600"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#4f46e5";
                      e.target.style.boxShadow = "0 0 0 4px rgba(79, 70, 229, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.some(d => !d)}
              style={{
                width: "100%",
                padding: "16px",
                background: loading || otp.some(d => !d) ? "#94a3b8" : "linear-gradient(145deg, #4f46e5, #6366f1)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading || otp.some(d => !d) ? "not-allowed" : "pointer",
                marginBottom: "15px"
              }}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <p style={{ textAlign: "center", color: "#64748b", fontSize: "14px" }}>
              Didn't receive code?{" "}
              <button
                type="button"
                onClick={handleEmailSubmit}
                style={{
                  background: "none",
                  border: "none",
                  color: "#4f46e5",
                  fontWeight: "600",
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                Resend
              </button>
            </p>
          </form>
        )}

        {/* New Password Step */}
        {step === "newPassword" && (
          <form onSubmit={handlePasswordSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#334155", fontWeight: "500" }}>
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "2px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#4f46e5";
                  e.target.style.boxShadow = "0 0 0 4px rgba(79, 70, 229, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#334155", fontWeight: "500" }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "2px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#4f46e5";
                  e.target.style.boxShadow = "0 0 0 4px rgba(79, 70, 229, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
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
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                marginBottom: "15px"
              }}
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Navigation Links */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate('/admin-login')}
            style={{
              background: "none",
              border: "none",
              color: "#64748b",
              fontSize: "14px",
              cursor: "pointer",
              textDecoration: "underline",
              marginRight: "15px"
            }}
          >
            ← Back to Login
          </button>
          
          {step !== "email" && (
            <button
              onClick={() => setStep("email")}
              style={{
                background: "none",
                border: "none",
                color: "#64748b",
                fontSize: "14px",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              Change Email
            </button>
          )}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
}