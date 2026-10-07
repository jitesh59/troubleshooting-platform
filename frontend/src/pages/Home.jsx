import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postsAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import {
  HiOutlineSearch,
  HiPlus,
  HiOutlineLogout,
  HiLightningBolt,
  HiSparkles,
  HiTerminal,
  HiCode,
  HiSupport,
  HiXCircle,
  HiQuestionMarkCircle,
} from "react-icons/hi";
import toast from "react-hot-toast";

const CATEGORIES = [
  { id: "all", label: "All Posts", icon: HiLightningBolt },
  { id: "general", label: "General", icon: HiSparkles },
  { id: "tech", label: "Technology", icon: HiTerminal },
  { id: "code", label: "Programming", icon: HiCode },
  { id: "bugs", label: "Bug Reports", icon: HiSupport },
];

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const searchTerm = activeCategory !== "all" && !query ? activeCategory : query;
      const r = await postsAPI.getAll({ search: searchTerm });
      setPosts(r.data.posts);
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [query, activeCategory]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
        e.preventDefault();
        document.getElementById("main-search-input")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const doSearch = (e) => {
    e.preventDefault();
    setQuery(search);
  };

  const clearFilter = () => {
    setQuery("");
    setSearch("");
    setActiveCategory("all");
  };

  const vote = async (id, type) => {
    if (!user) return toast.error("Log in to vote");
    try {
      const r = type === "up" ? await postsAPI.upvote(id) : await postsAPI.downvote(id);
      setPosts((p) =>
        p.map((x) =>
          x._id === id
            ? { ...x, upvotes: r.data.upvotes, downvotes: r.data.downvotes }
            : x
        )
      );
    } catch {
      toast.error("Vote failed");
    }
  };

  const del = (id) => setPosts((p) => p.filter((x) => x._id !== id));
  const commented = (id, c) => setPosts((p) => p.map((x) => (x._id === id ? { ...x, comments: c } : x)));

  const userInitial = (user?.username?.[0] || "U").toUpperCase();

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Background Ambient Glow Orbs */}
      <div
        style={{
          position: "fixed",
          top: "-150px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)",
          filter: "blur(90px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ━━━ Top Navigation Bar ━━━ */}
      <header className="glass-header" style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <div
          style={{
            maxWidth: 1040,
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            height: 64,
            gap: 16,
          }}
        >
          {/* Brand Logo */}
          <Link to="/" onClick={clearFilter} style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(99, 102, 241, 0.4)",
              }}
            >
              <HiLightningBolt size={22} color="#fff" />
            </div>
            <div>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "#fff",
                  display: "block",
                  lineHeight: 1.1,
                }}
              >
                Troubleshoot<span className="gradient-text">.io</span>
              </span>
              <span style={{ fontSize: 10, color: "var(--text-dim)", fontWeight: 600, letterSpacing: "0.05em" }}>
                DEV COMMUNITY
              </span>
            </div>
          </Link>

          {/* Search Input */}
          <form onSubmit={doSearch} style={{ flex: 1, maxWidth: 460 }}>
            <div style={{ position: "relative" }}>
              <HiOutlineSearch
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
                id="main-search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search solutions, bugs, tags... (Press '/' to focus)"
                type="text"
                style={{
                  width: "100%",
                  padding: "10px 40px 10px 42px",
                  borderRadius: 12,
                  fontSize: 13,
                  background: "var(--bg-input)",
                  border: "1px solid var(--border)",
                  color: "var(--text-white)",
                  outline: "none",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--brand-primary)";
                  e.target.style.boxShadow = "0 0 0 3px var(--brand-glow)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.boxShadow = "none";
                }}
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setQuery("");
                  }}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--text-dim)",
                    cursor: "pointer",
                    display: "flex",
                  }}
                >
                  <HiXCircle size={18} />
                </button>
              ) : (
                <span
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--text-dim)",
                    background: "rgba(255,255,255,0.06)",
                    padding: "2px 6px",
                    borderRadius: 4,
                    border: "1px solid var(--border)",
                  }}
                >
                  /
                </span>
              )}
            </div>
          </form>

          {/* Right Action Menu */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {user ? (
              <>
                <Link
                  to="/content"
                  className="gradient-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 18px",
                    borderRadius: 10,
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  <HiPlus size={16} /> New Post
                </Link>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "4px 10px 4px 4px",
                    borderRadius: 9999,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#fff",
                    }}
                  >
                    {userInitial}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-white)" }}>
                    {user.username}
                  </span>
                </div>

                <button
                  onClick={async () => {
                    await logout();
                    navigate("/");
                  }}
                  title="Logout"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: "8px",
                    cursor: "pointer",
                    color: "var(--text-dim)",
                    display: "flex",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--rose-accent)";
                    e.currentTarget.style.color = "var(--rose-accent)";
                    e.currentTarget.style.background = "rgba(244, 63, 94, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--text-dim)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }}
                >
                  <HiOutlineLogout size={16} />
                </button>
              </>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <Link
                  to="/login"
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid var(--border)",
                    color: "var(--text-white)",
                    fontSize: 13,
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                  }}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="gradient-btn"
                  style={{
                    padding: "8px 18px",
                    borderRadius: 10,
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ━━━ Main Layout (Feed + Sidebar) ━━━ */}
      <main
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          padding: "24px 20px",
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Left Column: Feed */}
        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Category Filter Chips */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 4,
            }}
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id && !query;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setQuery("");
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 14px",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    background: isActive
                      ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                      : "rgba(17, 24, 39, 0.7)",
                    border: isActive
                      ? "1px solid rgba(99, 102, 241, 0.5)"
                      : "1px solid var(--border)",
                    color: isActive ? "#fff" : "var(--text-gray)",
                    boxShadow: isActive ? "0 4px 16px rgba(99, 102, 241, 0.3)" : "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "var(--border-light)";
                      e.currentTarget.style.color = "var(--text-white)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text-gray)";
                    }
                  }}
                >
                  <Icon size={14} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Search Filter Banner */}
          {query && (
            <div
              className="anim-fade-in glass-panel"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                borderRadius: 12,
                fontSize: 13,
              }}
            >
              <span style={{ color: "var(--text-gray)" }}>
                Showing results for <strong style={{ color: "var(--brand-light)" }}>"{query}"</strong>
              </span>
              <button
                onClick={clearFilter}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: "4px 10px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-white)",
                  cursor: "pointer",
                }}
              >
                Clear Filter
              </button>
            </div>
          )}

          {/* Feed Content */}
          {loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 0",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  border: "3px solid var(--border)",
                  borderTopColor: "var(--brand-primary)",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                }}
              />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <p style={{ marginTop: 14, fontSize: 13, color: "var(--text-dim)", fontWeight: 500 }}>
                Fetching discussions...
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div
              className="anim-fade-in glass-panel"
              style={{
                textAlign: "center",
                padding: "60px 20px",
                borderRadius: 16,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "rgba(99, 102, 241, 0.1)",
                  border: "1px solid rgba(99, 102, 241, 0.2)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <HiQuestionMarkCircle size={30} color="#8b5cf6" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-white)" }}>
                {query ? "No matching solutions" : "No discussions yet"}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-dim)",
                  marginTop: 6,
                  maxWidth: 320,
                  margin: "6px auto 0 auto",
                }}
              >
                {query
                  ? `We couldn't find any post matching "${query}". Try searching another keyword.`
                  : "Be the pioneer! Ask a question or share a troubleshooting guide."}
              </p>
              {!query && user && (
                <Link
                  to="/content"
                  className="gradient-btn"
                  style={{
                    display: "inline-block",
                    marginTop: 20,
                    padding: "10px 24px",
                    borderRadius: 10,
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  Create First Post
                </Link>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {posts.map((p) => (
                <PostCard
                  key={p._id}
                  post={p}
                  onVote={vote}
                  onDelete={del}
                  onCommentAdded={commented}
                />
              ))}
            </div>
          )}
        </section>

        {/* Right Sidebar */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Community Info Card */}
          <div className="glass-panel" style={{ borderRadius: 16, padding: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
                fontSize: 14,
                fontWeight: 700,
                color: "var(--text-white)",
              }}
            >
              <HiSparkles color="#8b5cf6" size={18} />
              <span>About Community</span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-gray)",
                lineHeight: 1.6,
                marginBottom: 16,
              }}
            >
              Welcome to <strong>Troubleshoot.io</strong> — the collaborative hub for developers to post technical issues, share verified solutions, and help each other debug code.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                paddingTop: 12,
                borderTop: "1px solid var(--border)",
              }}
            >
              <div>
                <span style={{ fontSize: 16, fontWeight: 800, color: "var(--brand-light)", display: "block" }}>
                  {posts.length}
                </span>
                <span style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>Active Posts</span>
              </div>
              <div>
                <span style={{ fontSize: 16, fontWeight: 800, color: "var(--emerald-accent)", display: "block" }}>
                  24/7
                </span>
                <span style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>Support</span>
              </div>
            </div>
          </div>

          {/* Quick Guidelines Card */}
          <div className="glass-panel" style={{ borderRadius: 16, padding: 20 }}>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--text-white)",
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Posting Guidelines
            </h4>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                fontSize: 12,
                color: "var(--text-gray)",
                paddingLeft: 16,
              }}
            >
              <li>State the problem clearly in the post title.</li>
              <li>Include code snippets or step-by-step error logs.</li>
              <li>Tag the appropriate community or topic.</li>
              <li>Be respectful and upvote helpful answers!</li>
            </ul>
          </div>

          {/* Footer Info */}
          <p
            style={{
              fontSize: 11,
              color: "var(--text-dim)",
              textAlign: "center",
              lineHeight: 1.5,
              padding: "0 8px",
            }}
          >
            © 2026 Troubleshoot Platform. Built for developers worldwide.
          </p>
        </aside>
      </main>
    </div>
  );
};

export default Home;