import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff, HiLightningBolt, HiArrowLeft } from "react-icons/hi";
import toast from "react-hot-toast";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error("Passwords do not match");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      await signup({ username: form.username, email: form.email, password: form.password });
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px 12px 42px",
    borderRadius: 12,
    fontSize: 14,
    background: "var(--bg-input)",
    border: "1px solid var(--border)",
    color: "var(--text-white)",
    outline: "none",
    transition: "all 0.2s ease",
  };

  const focus = (e) => {
    e.target.style.borderColor = "var(--brand-primary)";
    e.target.style.boxShadow = "0 0 0 3px var(--brand-glow)";
  };

  const blur = (e) => {
    e.target.style.borderColor = "var(--border)";
    e.target.style.boxShadow = "none";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 20px",
        position: "relative",
      }}
    >
      {/* Background Ambient Glows */}
      <div
        style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)",
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />

      {/* Navigation back */}
      <Link
        to="/"
        style={{
          position: "fixed",
          top: 24,
          left: 24,
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "var(--text-gray)",
          fontSize: 13,
          fontWeight: 600,
          background: "rgba(17, 24, 39, 0.6)",
          padding: "8px 14px",
          borderRadius: 10,
          border: "1px solid var(--border)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.borderColor = "var(--border-light)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--text-gray)";
          e.currentTarget.style.borderColor = "var(--border)";
        }}
      >
        <HiArrowLeft size={16} /> Back to Feed
      </Link>

      {/* Main Form Card */}
      <div
        className="anim-fade-up glass-panel"
        style={{
          width: "100%",
          maxWidth: 440,
          borderRadius: 20,
          padding: 36,
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.5)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header Logo */}
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
              boxShadow: "0 8px 24px rgba(99, 102, 241, 0.4)",
            }}
          >
            <HiLightningBolt size={30} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-white)", letterSpacing: "-0.02em" }}>
            Create an Account
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 4 }}>
            Join developers sharing solutions and technical posts
          </p>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Username */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-dim)",
                marginBottom: 6,
              }}
            >
              Username
            </label>
            <div style={{ position: "relative" }}>
              <HiUser
                size={18}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-dim)",
                }}
              />
              <input
                name="username"
                type="text"
                required
                minLength={3}
                maxLength={20}
                value={form.username}
                onChange={set}
                placeholder="johndoe"
                style={inputStyle}
                onFocus={focus}
                onBlur={blur}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-dim)",
                marginBottom: 6,
              }}
            >
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <HiMail
                size={18}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-dim)",
                }}
              />
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={set}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={focus}
                onBlur={blur}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-dim)",
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <HiLockClosed
                size={18}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-dim)",
                }}
              />
              <input
                name="password"
                type={show ? "text" : "password"}
                required
                minLength={6}
                value={form.password}
                onChange={set}
                placeholder="At least 6 characters"
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={focus}
                onBlur={blur}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-dim)",
                  display: "flex",
                  padding: 2,
                }}
              >
                {show ? <HiEyeOff size={18} /> : <HiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-dim)",
                marginBottom: 6,
              }}
            >
              Confirm Password
            </label>
            <div style={{ position: "relative" }}>
              <HiLockClosed
                size={18}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-dim)",
                }}
              />
              <input
                name="confirm"
                type={show ? "text" : "password"}
                required
                value={form.confirm}
                onChange={set}
                placeholder="Re-enter password"
                style={inputStyle}
                onFocus={focus}
                onBlur={blur}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="gradient-btn"
            style={{
              width: "100%",
              padding: 13,
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              border: "none",
              color: "#fff",
              marginTop: 6,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: "center", paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: 13, color: "var(--text-gray)" }}>
            Already registered?{" "}
            <Link to="/login" style={{ color: "var(--brand-light)", fontWeight: 700 }}>
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;