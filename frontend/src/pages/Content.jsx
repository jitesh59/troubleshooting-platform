import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { postsAPI } from "../utils/api";
import { HiPencilAlt, HiTag, HiDocumentText, HiArrowLeft } from "react-icons/hi";
import toast from "react-hot-toast";

const Content = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", subreddit: "" });
  const [loading, setLoading] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Log in to post"); return navigate("/login"); }
    if (!form.title.trim() || !form.content.trim()) return toast.error("Title and content required");
    setLoading(true);
    try { await postsAPI.create(form); toast.success("Post created!"); navigate("/"); }
    catch (err) { toast.error(err.response?.data?.message || "Failed to create post"); }
    finally { setLoading(false); }
  };

  const inputBox = {
    width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 13,
    background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-white)", outline: "none",
    transition: "border-color .2s, box-shadow .2s",
  };
  const focus = (e) => { e.target.style.borderColor = "var(--brand)"; e.target.style.boxShadow = "0 0 0 3px var(--brand-glow)"; };
  const blur = (e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; };

  return (
    <div style={{ background: "var(--bg-body)", minHeight: "100vh" }}>

      {/* Top bar */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(15,15,15,.82)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", height: 56, gap: 12 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-gray)", fontSize: 13, fontWeight: 500, transition: "color .15s" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-white)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-gray)"}>
            <HiArrowLeft size={16} /> Back
          </Link>
          <div style={{ flex: 1 }} />
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: "var(--text-white)" }}>Troubleshooting</span>
          </Link>
          <div style={{ flex: 1 }} />
        </div>
      </header>

      {/* Form */}
      <main style={{ maxWidth: 620, margin: "0 auto", padding: "32px 16px" }}>
        <div className="anim-fade-up" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 28, boxShadow: "0 12px 40px rgba(0,0,0,.3)" }}>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <HiPencilAlt size={18} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-white)" }}>Create a Post</h1>
              <p style={{ fontSize: 12, color: "var(--text-dim)" }}>Share something with the community</p>
            </div>
          </div>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Community */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-dim)", marginBottom: 6 }}>
                <HiTag size={12} /> Community
              </label>
              <input name="subreddit" type="text" value={form.subreddit} onChange={set}
                placeholder="e.g. technology" style={inputBox} onFocus={focus} onBlur={blur} />
              <p style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>Leave empty for "general"</p>
            </div>

            {/* Title */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-dim)", marginBottom: 6 }}>
                <HiPencilAlt size={12} /> Title
              </label>
              <input name="title" type="text" required maxLength={300} value={form.title} onChange={set}
                placeholder="An interesting title" style={inputBox} onFocus={focus} onBlur={blur} />
              <p style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4, textAlign: "right" }}>{form.title.length}/300</p>
            </div>

            {/* Content */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-dim)", marginBottom: 6 }}>
                <HiDocumentText size={12} /> Content
              </label>
              <textarea name="content" required maxLength={10000} rows={7} value={form.content} onChange={set}
                placeholder="What's on your mind?"
                style={{ ...inputBox, padding: "12px 14px", resize: "none" }} onFocus={focus} onBlur={blur} />
              <p style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4, textAlign: "right" }}>{form.content.length}/10000</p>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <button type="button" onClick={() => navigate("/")} style={{
                flex: 1, padding: 11, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-gray)", transition: "all .15s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.color = "var(--text-white)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-gray)"; }}
              >Cancel</button>
              <button type="submit" disabled={loading} style={{
                flex: 1, padding: 11, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
                background: "var(--brand)", border: "none", color: "#fff",
                opacity: loading ? 0.5 : 1, transition: "transform .15s, opacity .2s",
              }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              >{loading ? "Posting…" : "Post"}</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Content;