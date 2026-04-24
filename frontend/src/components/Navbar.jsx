import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiOutlineSearch, HiPlus, HiOutlineLogin, HiOutlineLogout, HiMenu, HiX } from "react-icons/hi";
import { FaRedditAlien } from "react-icons/fa";

const Navbar = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <nav
      id="main-navbar"
      className="sticky top-0 z-50"
      style={{
        backgroundColor: "rgba(26, 29, 33, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            id="logo-link"
            className="flex items-center gap-2 no-underline shrink-0"
            style={{ color: "var(--text-primary)" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                boxShadow: "0 0 15px rgba(255, 69, 0, 0.3)",
              }}
            >
              <FaRedditAlien size={20} color="#fff" />
            </div>
            <span className="text-xl font-bold hidden sm:block" style={{
              background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Troubleshooting
            </span>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex flex-1 max-w-xl mx-4"
          >
            <div className="relative w-full group">
              <HiOutlineSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                size={18}
                style={{ color: "var(--text-muted)" }}
              />
              <input
                id="search-input"
                type="text"
                placeholder="Search Troubleshooting..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full text-sm transition-all duration-300 focus:outline-none"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent-blue)";
                  e.target.style.backgroundColor = "var(--bg-secondary)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(0, 121, 211, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-color)";
                  e.target.style.backgroundColor = "var(--bg-tertiary)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </form>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/content"
                  id="create-post-btn"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold no-underline transition-all duration-200 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                    color: "#fff",
                    boxShadow: "0 2px 10px rgba(255, 69, 0, 0.3)",
                  }}
                >
                  <HiPlus size={16} />
                  Create
                </Link>

                <div className="flex items-center gap-2 ml-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      color: "#fff",
                    }}
                  >
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden lg:block" style={{ color: "var(--text-primary)" }}>
                    {user.username}
                  </span>
                  <button
                    id="logout-btn"
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "var(--accent-red)";
                      e.target.style.color = "var(--accent-red)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "var(--border-color)";
                      e.target.style.color = "var(--text-secondary)";
                    }}
                  >
                    <HiOutlineLogout size={14} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                id="login-btn"
                className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold no-underline transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                  color: "#fff",
                  boxShadow: "0 2px 10px rgba(255, 69, 0, 0.3)",
                }}
              >
                <HiOutlineLogin size={16} />
                Log In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            id="mobile-menu-btn"
            className="sm:hidden p-2 rounded-lg cursor-pointer"
            style={{ backgroundColor: "transparent", border: "none", color: "var(--text-primary)" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden pb-4 animate-slide-down" style={{ borderTop: "1px solid var(--border-color)" }}>
            <form onSubmit={handleSearch} className="mt-3 mb-3">
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  placeholder="Search Reditt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm focus:outline-none"
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </form>
            {user ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-2 py-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff" }}>
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{user.username}</span>
                </div>
                <Link to="/content" className="block px-4 py-2.5 rounded-lg text-sm font-medium no-underline"
                  style={{ color: "var(--text-primary)", backgroundColor: "var(--bg-tertiary)" }}
                  onClick={() => setMobileMenuOpen(false)}>
                  <HiPlus className="inline mr-2" size={16} /> Create Post
                </Link>
                <button onClick={handleLogout}
                  className="text-left px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer"
                  style={{ color: "var(--accent-red)", backgroundColor: "var(--bg-tertiary)", border: "none" }}>
                  <HiOutlineLogout className="inline mr-2" size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-center no-underline"
                  style={{ background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))", color: "#fff" }}
                  onClick={() => setMobileMenuOpen(false)}>
                  Log In
                </Link>
                <Link to="/signup" className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-center no-underline"
                  style={{ border: "1px solid var(--accent-orange)", color: "var(--accent-orange)" }}
                  onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
