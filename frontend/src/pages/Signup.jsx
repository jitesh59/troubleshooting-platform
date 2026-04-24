import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
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
    if (form.password !== form.confirm) return toast.error("Passwords don't match");
    if (form.password.length < 6) return toast.error("Password must be 6+ characters");
    setLoading(true);
    try {
      await signup({ username: form.username, email: form.email, password: form.password });
      toast.success("Account created!"); navigate("/");
    } catch (err) { toast.error(err.response?.data?.message || "Signup failed"); }
    finally { setLoading(false); }
  };

  const inputBox = {
    width: "100%", padding: "10px 12px 10px 40px", borderRadius: 10, fontSize: 13,
    background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-white)", outline: "none",
    transition: "border-color .2s, box-shadow .2s",
  };
  const focus = (e) => { e.target.style.borderColor = "var(--brand)"; e.target.style.boxShadow = "0 0 0 3px var(--brand-glow)"; };
  const blur = (e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; };

  return (
    <div style={{ background: "var(--bg-body)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>

      {/* Glow */}
      <div style={{ position: "fixed", top: -100, left: "50%", transform: "translateX(-50%)", width: 500, height: 400, background: "radial-gradient(ellipse, var(--brand-glow) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />

      <div className="anim-fade-up" style={{ width: "100%", maxWidth: 400, background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 36, boxShadow: "0 20px 60px rgba(0,0,0,.4)", position: "relative" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--brand)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14, boxShadow: "0 0 24px var(--brand-glow)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-white)" }}>Join Troubleshooting</h1>
          <p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 4 }}>Create your account and start posting</p>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Username */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-dim)", marginBottom: 6 }}>Username</label>
            <div style={{ position: "relative" }}>
              <HiUser size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
              <input name="username" type="text" required minLength={3} maxLength={20} value={form.username} onChange={set}
                placeholder="Choose a username" style={inputBox} onFocus={focus} onBlur={blur} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-dim)", marginBottom: 6 }}>Email</label>
            <div style={{ position: "relative" }}>
              <HiMail size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
              <input name="email" type="email" required value={form.email} onChange={set}
                placeholder="you@example.com" style={inputBox} onFocus={focus} onBlur={blur} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-dim)", marginBottom: 6 }}>Password</label>
            <div style={{ position: "relative" }}>
              <HiLockClosed size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
              <input name="password" type={show ? "text" : "password"} required minLength={6} value={form.password} onChange={set}
                placeholder="At least 6 characters" style={{ ...inputBox, paddingRight: 40 }} onFocus={focus} onBlur={blur} />
              <button type="button" onClick={() => setShow(!show)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-dim)", padding: 0 }}>
                {show ? <HiEyeOff size={16} /> : <HiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-dim)", marginBottom: 6 }}>Confirm Password</label>
            <div style={{ position: "relative" }}>
              <HiLockClosed size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
              <input name="confirm" type={show ? "text" : "password"} required value={form.confirm} onChange={set}
                placeholder="Confirm password" style={inputBox} onFocus={focus} onBlur={blur} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: 11, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
            background: "var(--brand)", border: "none", color: "#fff", marginTop: 4,
            opacity: loading ? 0.5 : 1, transition: "transform .15s, opacity .2s",
          }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "scale(1.02)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-dim)", marginTop: 20 }}>
          Already a Redditor?{" "}
          <Link to="/login" style={{ color: "var(--brand-light)", fontWeight: 600 }}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;