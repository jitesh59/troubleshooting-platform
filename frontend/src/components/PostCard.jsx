import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { postsAPI } from "../utils/api";
import {
  HiArrowUp,
  HiArrowDown,
  HiChat,
  HiTrash,
  HiShare,
  HiBookmark,
  HiOutlineBookmark,
  HiSparkles,
  HiCheckCircle,
} from "react-icons/hi";
import toast from "react-hot-toast";

const PostCard = ({ post, onVote, onDelete, onCommentAdded }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [voteBounce, setVoteBounce] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const isUpvoted = user && post.upvotes?.some((id) => (id._id || id) === user._id);
  const isDownvoted = user && post.downvotes?.some((id) => (id._id || id) === user._id);
  const score = (post.upvotes?.length || 0) - (post.downvotes?.length || 0);
  const isAuthor = user && post.author?._id === user._id;

  const ago = (d) => {
    if (!d) return "just now";
    const s = Math.floor((Date.now() - new Date(d)) / 1000);
    if (s < 60) return "just now";
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const dy = Math.floor(h / 24);
    if (dy < 30) return `${dy}d ago`;
    return `${Math.floor(dy / 30)}mo ago`;
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
      toast.success("Comment added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const delPost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await postsAPI.delete(post._id);
      onDelete?.(post._id);
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `/#post-${post._id}`);
    toast.success("Post link copied to clipboard!");
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    toast.success(!isSaved ? "Post saved to your bookmarks" : "Post removed from bookmarks");
  };

  const authorLetter = (post.author?.username?.[0] || "?").toUpperCase();

  return (
    <article
      id={`post-${post._id}`}
      className="anim-fade-up glass-panel"
      style={{
        borderRadius: 16,
        overflow: "hidden",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "1px solid var(--border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-brand)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ display: "flex" }}>
        {/* Voting Sidebar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            padding: "16px 12px",
            background: "rgba(15, 23, 42, 0.4)",
            borderRight: "1px solid var(--border)",
            justifyContent: "flex-start",
          }}
        >
          <button
            onClick={() => vote("up")}
            className={voteBounce === "up" ? "anim-pop" : ""}
            title="Upvote"
            style={{
              background: isUpvoted ? "rgba(16, 185, 129, 0.15)" : "transparent",
              border: isUpvoted ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid transparent",
              borderRadius: 8,
              cursor: "pointer",
              color: isUpvoted ? "var(--upvote-color)" : "var(--text-dim)",
              transition: "all 0.2s ease",
              padding: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              if (!isUpvoted) {
                e.currentTarget.style.color = "var(--upvote-color)";
                e.currentTarget.style.background = "rgba(16, 185, 129, 0.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isUpvoted) {
                e.currentTarget.style.color = "var(--text-dim)";
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            <HiArrowUp size={18} />
          </button>

          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: isUpvoted
                ? "var(--upvote-color)"
                : isDownvoted
                ? "var(--downvote-color)"
                : "var(--text-white)",
              minWidth: 24,
              textAlign: "center",
              padding: "2px 0",
            }}
          >
            {score}
          </span>

          <button
            onClick={() => vote("down")}
            className={voteBounce === "down" ? "anim-pop" : ""}
            title="Downvote"
            style={{
              background: isDownvoted ? "rgba(6, 182, 212, 0.15)" : "transparent",
              border: isDownvoted ? "1px solid rgba(6, 182, 212, 0.3)" : "1px solid transparent",
              borderRadius: 8,
              cursor: "pointer",
              color: isDownvoted ? "var(--downvote-color)" : "var(--text-dim)",
              transition: "all 0.2s ease",
              padding: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              if (!isDownvoted) {
                e.currentTarget.style.color = "var(--downvote-color)";
                e.currentTarget.style.background = "rgba(6, 182, 212, 0.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isDownvoted) {
                e.currentTarget.style.color = "var(--text-dim)";
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            <HiArrowDown size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, padding: "20px 20px 16px 20px" }}>
          {/* Metadata Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Community Tag */}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#a5b4fc",
                  background: "rgba(99, 102, 241, 0.15)",
                  border: "1px solid rgba(99, 102, 241, 0.25)",
                  padding: "3px 10px",
                  borderRadius: 9999,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <HiSparkles size={11} color="#8b5cf6" />
                r/{post.subreddit || "general"}
              </span>

              {/* Author Badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {authorLetter}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-gray)" }}>
                  u/{post.author?.username || "anonymous"}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-dim)" }}>· {ago(post.createdAt)}</span>
              </div>
            </div>

            {/* Solved / Active Tag */}
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--emerald-accent)",
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                padding: "2px 8px",
                borderRadius: 6,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <HiCheckCircle size={12} /> Open
            </span>
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "var(--text-white)",
              marginBottom: 8,
              lineHeight: 1.4,
              letterSpacing: "-0.01em",
            }}
          >
            {post.title}
          </h2>

          {/* Body Text */}
          <p
            style={{
              fontSize: 14,
              color: "var(--text-gray)",
              lineHeight: 1.65,
              marginBottom: 16,
              whiteSpace: "pre-line",
              display: "-webkit-box",
              WebkitLineClamp: 5,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.content}
          </p>

          {/* Action Toolbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              paddingTop: 12,
              borderTop: "1px solid var(--border)",
              flexWrap: "wrap",
            }}
          >
            <ActionButton
              onClick={() => setShowComments(!showComments)}
              active={showComments}
            >
              <HiChat size={16} />
              <span>{post.comments?.length || 0} Comments</span>
            </ActionButton>

            <ActionButton onClick={copyLink}>
              <HiShare size={15} />
              <span>Share</span>
            </ActionButton>

            <ActionButton onClick={toggleSave} active={isSaved}>
              {isSaved ? <HiBookmark size={15} color="#8b5cf6" /> : <HiOutlineBookmark size={15} />}
              <span>{isSaved ? "Saved" : "Save"}</span>
            </ActionButton>

            {isAuthor && (
              <ActionButton onClick={delPost} danger>
                <HiTrash size={15} />
                <span>Delete</span>
              </ActionButton>
            )}
          </div>

          {/* Comments Expansion Drawer */}
          {showComments && (
            <div
              className="anim-fade-in"
              style={{
                marginTop: 16,
                paddingTop: 16,
                borderTop: "1px solid var(--border)",
              }}
            >
              {/* Comment Input */}
              {user ? (
                <form onSubmit={submitComment} style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      background: "rgba(15, 23, 42, 0.6)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      padding: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      {(user.username?.[0] || "U").toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add your solution or response..."
                        rows={2}
                        style={{
                          width: "100%",
                          background: "transparent",
                          border: "none",
                          color: "var(--text-white)",
                          fontSize: 13,
                          outline: "none",
                          resize: "none",
                          fontFamily: "inherit",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justify: "flex-end",
                          marginTop: 6,
                          paddingTop: 6,
                          borderTop: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <button
                          type="submit"
                          disabled={submitting || !commentText.trim()}
                          className="gradient-btn"
                          style={{
                            padding: "6px 16px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#fff",
                            border: "none",
                            cursor: submitting || !commentText.trim() ? "not-allowed" : "pointer",
                            opacity: submitting || !commentText.trim() ? 0.4 : 1,
                          }}
                        >
                          {submitting ? "Posting..." : "Reply"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    background: "rgba(15, 23, 42, 0.4)",
                    border: "1px solid var(--border)",
                    textAlign: "center",
                    fontSize: 13,
                    color: "var(--text-dim)",
                    marginBottom: 16,
                  }}
                >
                  Log in to join the discussion.
                </div>
              )}

              {/* Comment List */}
              {post.comments?.length === 0 ? (
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-dim)",
                    textAlign: "center",
                    padding: "16px 0",
                  }}
                >
                  No comments yet. Be the first to reply!
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {post.comments?.map((c, i) => {
                    const cAuthorLetter = (c.user?.username?.[0] || "?").toUpperCase();
                    return (
                      <div
                        key={c._id || i}
                        style={{
                          display: "flex",
                          gap: 12,
                          padding: "10px 12px",
                          borderRadius: 10,
                          background: "rgba(15, 23, 42, 0.3)",
                          border: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                            fontWeight: 700,
                            color: "var(--brand-light)",
                            flexShrink: 0,
                          }}
                        >
                          {cAuthorLetter}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              marginBottom: 4,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: "var(--text-white)",
                              }}
                            >
                              u/{c.user?.username || "deleted"}
                            </span>
                            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
                              · {ago(c.createdAt)}
                            </span>
                          </div>
                          <p
                            style={{
                              fontSize: 13,
                              color: "var(--text-gray)",
                              lineHeight: 1.5,
                            }}
                          >
                            {c.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

/* Action Button Subcomponent */
const ActionButton = ({ children, onClick, active, danger }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        background: active ? "rgba(99, 102, 241, 0.15)" : "transparent",
        border: active ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid transparent",
        color: danger ? "var(--rose-accent)" : active ? "#a5b4fc" : "var(--text-dim)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (!active && !danger) {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
          e.currentTarget.style.color = "var(--text-white)";
        } else if (danger) {
          e.currentTarget.style.background = "rgba(244, 63, 94, 0.1)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active && !danger) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--text-dim)";
        } else if (danger) {
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
      {children}
    </button>
  );
};

export default PostCard;
