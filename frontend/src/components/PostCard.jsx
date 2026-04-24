import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { postsAPI } from "../utils/api";
import { HiArrowUp, HiArrowDown, HiChat, HiTrash } from "react-icons/hi";
import toast from "react-hot-toast";

const PostCard = ({ post, onVote, onDelete, onCommentAdded }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [voteBounce, setVoteBounce] = useState(null);

  const isUpvoted = user && post.upvotes?.some((id) => (id._id || id) === user._id);
  const isDownvoted = user && post.downvotes?.some((id) => (id._id || id) === user._id);
  const score = (post.upvotes?.length || 0) - (post.downvotes?.length || 0);
  const isAuthor = user && post.author?._id === user._id;

  const ago = (d) => {
    const s = Math.floor((Date.now() - new Date(d)) / 1000);
    if (s < 60) return "now";
    const m = Math.floor(s / 60);  if (m < 60) return m + "m";
    const h = Math.floor(m / 60);  if (h < 24) return h + "h";
    const dy = Math.floor(h / 24); if (dy < 30) return dy + "d";
    return Math.floor(dy / 30) + "mo";
  };

  const vote = (type) => {
    if (!user) return toast.error("Log in to vote");
    setVoteBounce(type);
    setTimeout(() => setVoteBounce(null), 250);
    onVote?.(post._id, type);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) return toast.error("Log in to comment");
    setSubmitting(true);
    try {
      const res = await postsAPI.addComment(post._id, { text: commentText });
      setCommentText("");
      onCommentAdded?.(post._id, res.data.comments);
      toast.success("Comment posted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Comment failed");
    } finally { setSubmitting(false); }
  };

  const delPost = async () => {
    if (!confirm("Delete this post?")) return;
    try { await postsAPI.delete(post._id); onDelete?.(post._id); toast.success("Deleted"); }
    catch { toast.error("Delete failed"); }
  };

  return (
    <article className="anim-fade-up" style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      transition: "border-color .2s, box-shadow .2s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,.35)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex" }}>
        {/* Votes */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "16px 12px", background: "rgba(0,0,0,.18)", borderRadius: "12px 0 0 12px" }}>
          <button onClick={() => vote("up")} className={voteBounce === "up" ? "anim-pop" : ""}
            style={{ background: "none", border: "none", cursor: "pointer", color: isUpvoted ? "var(--upvote-color)" : "var(--text-dim)", transition: "color .15s", padding: 4 }}>
            <HiArrowUp size={20} />
          </button>
          <span style={{ fontSize: 12, fontWeight: 700, color: isUpvoted ? "var(--upvote-color)" : isDownvoted ? "var(--downvote-color)" : "var(--text-white)", minWidth: 20, textAlign: "center" }}>
            {score}
          </span>
          <button onClick={() => vote("down")} className={voteBounce === "down" ? "anim-pop" : ""}
            style={{ background: "none", border: "none", cursor: "pointer", color: isDownvoted ? "var(--downvote-color)" : "var(--text-dim)", transition: "color .15s", padding: 4 }}>
            <HiArrowDown size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: 16 }}>
          {/* Meta row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--brand-light)", background: "var(--brand-glow)", padding: "2px 10px", borderRadius: 99 }}>
              r/{post.subreddit}
            </span>
            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
              u/{post.author?.username} · {ago(post.createdAt)}
            </span>
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-white)", marginBottom: 6, lineHeight: 1.35 }}>{post.title}</h3>

          <p style={{
            fontSize: 13, color: "var(--text-gray)", lineHeight: 1.6, marginBottom: 12,
            display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{post.content}</p>

          {/* Action bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <ActionBtn onClick={() => setShowComments(!showComments)}>
              <HiChat size={15} /> {post.comments?.length || 0} Comments
            </ActionBtn>
            {isAuthor && (
              <ActionBtn onClick={delPost} hoverColor="var(--red)">
                <HiTrash size={14} /> Delete
              </ActionBtn>
            )}
          </div>

          {/* Comments */}
          {showComments && (
            <div className="anim-fade-in" style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              {user && (
                <form onSubmit={submitComment} style={{ marginBottom: 16 }}>
                  <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment…" rows={2}
                    style={{
                      width: "100%", padding: 10, borderRadius: 8, fontSize: 13, resize: "none",
                      background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-white)", outline: "none",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--brand)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                    <button type="submit" disabled={submitting || !commentText.trim()}
                      style={{
                        padding: "6px 16px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
                        background: "var(--brand)", border: "none", color: "#fff", opacity: submitting || !commentText.trim() ? 0.4 : 1,
                      }}>
                      {submitting ? "Posting…" : "Reply"}
                    </button>
                  </div>
                </form>
              )}
              {post.comments?.length === 0 && <p style={{ fontSize: 13, color: "var(--text-dim)", textAlign: "center", padding: 12 }}>No comments yet</p>}
              {post.comments?.map((c, i) => (
                <div key={c._id || i} style={{ paddingLeft: 12, paddingTop: 8, paddingBottom: 8, borderLeft: "2px solid var(--border)", marginBottom: 6 }}>
                  <div style={{ fontSize: 11, color: "var(--brand-light)", fontWeight: 600, marginBottom: 2 }}>
                    u/{c.user?.username || "deleted"} <span style={{ color: "var(--text-dim)", fontWeight: 400 }}>· {ago(c.createdAt)}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-gray)" }}>{c.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

/* Tiny reusable button for action bar */
const ActionBtn = ({ children, onClick, hoverColor }) => {
  const base = "var(--text-dim)";
  return (
    <button onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "none", border: "none", color: base, transition: "all .15s" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-elevated)"; e.currentTarget.style.color = hoverColor || "var(--text-white)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = base; }}
    >{children}</button>
  );
};

export default PostCard;
