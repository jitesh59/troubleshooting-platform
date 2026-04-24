import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postsAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import { HiOutlineSearch, HiPlus, HiOutlineLogout } from "react-icons/hi";
import toast from "react-hot-toast";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    try { const r = await postsAPI.getAll({ search: query }); setPosts(r.data.posts); }
    catch { toast.error("Failed to load posts"); }
    finally { setLoading(false); }
  }, [query]);

  useEffect(() => { fetch(); }, [fetch]);

  const doSearch = (e) => { e.preventDefault(); setQuery(search); };

  const vote = async (id, type) => {
    if (!user) return toast.error("Log in to vote");
    try {
      const r = type === "up" ? await postsAPI.upvote(id) : await postsAPI.downvote(id);
      setPosts((p) => p.map((x) => x._id === id ? { ...x, upvotes: r.data.upvotes, downvotes: r.data.downvotes } : x));
    } catch { toast.error("Vote failed"); }
  };

  const del = (id) => setPosts((p) => p.filter((x) => x._id !== id));
  const commented = (id, c) => setPosts((p) => p.map((x) => x._id === id ? { ...x, comments: c } : x));

  return (
    <div style={{ background: "var(--bg-body)", minHeight: "100vh" }}>

      {/* ━━━ Top bar ━━━ */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(15,15,15,.82)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", height: 56, gap: 14 }}>

          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px var(--brand-glow)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "var(--text-white)", letterSpacing: -0.5 }}>Troubleshooting</span>
          </Link>

          {/* Search */}
          <form onSubmit={doSearch} style={{ flex: 1, maxWidth: 420 }}>
            <div style={{ position: "relative" }}>
              <HiOutlineSearch size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…" type="text"
                style={{
                  width: "100%", padding: "8px 12px 8px 36px", borderRadius: 99, fontSize: 13,
                  background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-white)", outline: "none",
                  transition: "border-color .2s, box-shadow .2s",
                }}
                onFocus={(e) => { e.target.style.borderColor = "var(--brand)"; e.target.style.boxShadow = "0 0 0 3px var(--brand-glow)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          </form>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {user ? (
              <>
                <Link to="/content" style={{
                  display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: 99,
                  background: "var(--brand)", color: "#fff", fontSize: 12, fontWeight: 600, transition: "transform .15s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                ><HiPlus size={14} /> Post</Link>

                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #6c5ce7, #fd79a8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>
                  {user.username?.[0]?.toUpperCase()}
                </div>

                <button onClick={async () => { await logout(); navigate("/"); }}
                  style={{ background: "none", border: "1px solid var(--border)", borderRadius: 99, padding: "5px 8px", cursor: "pointer", color: "var(--text-dim)", display: "flex", transition: "all .15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--red)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-dim)"; }}
                ><HiOutlineLogout size={14} /></button>
              </>
            ) : (
              <Link to="/login" style={{
                padding: "6px 18px", borderRadius: 99, background: "var(--brand)", color: "#fff",
                fontSize: 12, fontWeight: 600, transition: "transform .15s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >Log In</Link>
            )}
          </div>
        </div>
      </header>

      {/* ━━━ Content ━━━ */}
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>

        {/* Search chip */}
        {query && (
          <div className="anim-fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, padding: "8px 14px", borderRadius: 8, background: "var(--bg-surface)", border: "1px solid var(--border)", fontSize: 13 }}>
            <span style={{ color: "var(--text-gray)" }}>Results for <strong style={{ color: "var(--text-white)" }}>"{query}"</strong></span>
            <button onClick={() => { setQuery(""); setSearch(""); }}
              style={{ background: "var(--bg-elevated)", border: "none", borderRadius: 4, padding: "3px 10px", fontSize: 11, color: "var(--brand-light)", cursor: "pointer" }}>
              Clear
            </button>
          </div>
        )}

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 100 }}>
            <div style={{ width: 32, height: 32, border: "3px solid var(--border)", borderTopColor: "var(--brand)", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ marginTop: 12, fontSize: 13, color: "var(--text-dim)" }}>Loading…</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="anim-fade-in" style={{ textAlign: "center", paddingTop: 100 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--bg-elevated)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--text-dim)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-white)" }}>
              {query ? "No results" : "No posts yet"}
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 4 }}>
              {query ? `Nothing matches "${query}"` : "Be the first to share something!"}
            </p>
            {!query && user && (
              <Link to="/content" style={{ display: "inline-block", marginTop: 16, padding: "8px 20px", borderRadius: 99, background: "var(--brand)", color: "#fff", fontSize: 13, fontWeight: 600 }}>
                Create Post
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {posts.map((p) => (
              <PostCard key={p._id} post={p} onVote={vote} onDelete={del} onCommentAdded={commented} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;