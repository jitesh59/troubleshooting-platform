import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { postsAPI } from "../utils/api";
import {
  HiPencilAlt,
  HiTag,
  HiDocumentText,
  HiArrowLeft,
  HiLightningBolt,
  HiEye,
  HiCode,
} from "react-icons/hi";
import toast from "react-hot-toast";

const PRESET_COMMUNITIES = ["general", "technology", "programming", "bugs", "hardware"];

const Content = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", subreddit: "general" });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("write"); // "write" or "preview"

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to publish a post");
      return navigate("/login");
    }
    if (!form.title.trim() || !form.content.trim()) {
      return toast.error("Title and content are required");
    }
    setLoading(true);
    try {
      await postsAPI.create(form);
      toast.success("Post published successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const insertFormatting = (prefix, suffix = "") => {
    setForm((prev) => ({
      ...prev,
      content: prev.content + `${prefix}text${suffix}`,
    }));
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
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
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Top Header */}
      <header className="glass-header" style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            height: 64,
            justifyContent: "space-between",
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "var(--text-gray)",
              fontSize: 13,
              fontWeight: 600,
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-gray)")}
          >
            <HiArrowLeft size={16} /> Back to Discussions
          </Link>

          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HiLightningBolt size={18} color="#fff" />
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>
              Troubleshoot<span className="gradient-text">.io</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px" }}>
        <div
          className="anim-fade-up glass-panel"
          style={{
            borderRadius: 20,
            padding: 32,
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
          }}
        >
          {/* Title Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 28,
              paddingBottom: 20,
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 20px rgba(99, 102, 241, 0.3)",
              }}
            >
              <HiPencilAlt size={22} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-white)", letterSpacing: "-0.01em" }}>
                Create a Discussion
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-dim)" }}>
                Ask for help, share an issue, or post a developer solution
              </p>
            </div>
          </div>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Community Topic Chips */}
            <div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-dim)",
                  marginBottom: 8,
                }}
              >
                <HiTag size={14} color="#8b5cf6" /> Topic / Subreddit
              </label>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                {PRESET_COMMUNITIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm({ ...form, subreddit: c })}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      background: form.subreddit === c ? "rgba(99, 102, 241, 0.2)" : "rgba(15, 23, 42, 0.6)",
                      border: form.subreddit === c ? "1px solid rgba(99, 102, 241, 0.5)" : "1px solid var(--border)",
                      color: form.subreddit === c ? "#a5b4fc" : "var(--text-gray)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    r/{c}
                  </button>
                ))}
              </div>

              <input
                name="subreddit"
                type="text"
                value={form.subreddit}
                onChange={set}
                placeholder="Or type custom topic e.g. react native"
                style={inputStyle}
                onFocus={focus}
                onBlur={blur}
              />
            </div>

            {/* Post Title */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--text-dim)",
                  }}
                >
                  <HiPencilAlt size={14} color="#8b5cf6" /> Post Title
                </label>
                <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
                  {form.title.length}/300
                </span>
              </div>
              <input
                name="title"
                type="text"
                required
                maxLength={300}
                value={form.title}
                onChange={set}
                placeholder="e.g. How to fix CORS policy error in Node.js Express server?"
                style={inputStyle}
                onFocus={focus}
                onBlur={blur}
              />
            </div>

            {/* Content & Tab Switcher */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--text-dim)",
                  }}
                >
                  <HiDocumentText size={14} color="#8b5cf6" /> Details & Explanation
                </label>

                {/* Write vs Preview Tabs */}
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    background: "rgba(15, 23, 42, 0.6)",
                    padding: 3,
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveTab("write")}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      background: activeTab === "write" ? "var(--brand-primary)" : "transparent",
                      color: activeTab === "write" ? "#fff" : "var(--text-dim)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      background: activeTab === "preview" ? "var(--brand-primary)" : "transparent",
                      color: activeTab === "preview" ? "#fff" : "var(--text-dim)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <HiEye size={12} /> Preview
                  </button>
                </div>
              </div>

              {activeTab === "write" ? (
                <>
                  {/* Markdown Helper Toolbar */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 10px",
                      background: "rgba(15, 23, 42, 0.5)",
                      border: "1px solid var(--border)",
                      borderBottom: "none",
                      borderRadius: "12px 12px 0 0",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => insertFormatting("**", "**")}
                      style={toolbarBtnStyle}
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("`", "`")}
                      style={toolbarBtnStyle}
                      title="Inline Code"
                    >
                      <HiCode size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("\n```js\n", "\n```\n")}
                      style={{ ...toolbarBtnStyle, fontSize: 10 }}
                      title="Code Block"
                    >
                      {"{ }"}
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("> ")}
                      style={toolbarBtnStyle}
                      title="Quote"
                    >
                      "
                    </button>
                  </div>

                  <textarea
                    name="content"
                    required
                    maxLength={10000}
                    rows={8}
                    value={form.content}
                    onChange={set}
                    placeholder="Describe what you were trying to achieve, what actually happened, and include any error trace logs..."
                    style={{
                      ...inputStyle,
                      borderRadius: "0 0 12px 12px",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                    onFocus={focus}
                    onBlur={blur}
                  />
                </>
              ) : (
                <div
                  style={{
                    minHeight: 200,
                    padding: 16,
                    borderRadius: 12,
                    background: "rgba(15, 23, 42, 0.6)",
                    border: "1px solid var(--border)",
                    color: "var(--text-white)",
                    fontSize: 14,
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                  }}
                >
                  {form.content ? (
                    form.content
                  ) : (
                    <span style={{ color: "var(--text-dim)", fontStyle: "italic" }}>
                      Nothing to preview yet. Start typing in the Write tab!
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Form Action Buttons */}
            <div style={{ display: "flex", gap: 12, paddingTop: 12 }}>
              <button
                type="button"
                onClick={() => navigate("/")}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border)",
                  color: "var(--text-gray)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-light)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-gray)";
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="gradient-btn"
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  border: "none",
                  color: "#fff",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Publishing..." : "Publish Post"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

const toolbarBtnStyle = {
  background: "transparent",
  border: "none",
  color: "var(--text-gray)",
  cursor: "pointer",
  padding: "4px 8px",
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default Content;