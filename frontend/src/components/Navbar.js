import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="glass" style={{ 
      position: 'sticky', top: 0, zIndex: 100,
      padding: "1rem 0", 
    }}>
      <div className="nav-container">
        <Link to="/" style={{ 
          textDecoration: 'none', 
          fontSize: '1.5rem', 
          fontWeight: 700, 
          color: 'var(--primary)',
          fontFamily: 'Outfit',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🚀 <span className="hide-mobile">TaskManager</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={toggleTheme} 
            style={{ 
              background: 'var(--primary-light)', 
              color: 'var(--primary)', 
              padding: '8px 12px',
              fontSize: '1.2rem'
            }}
            title="Toggle Theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }} className="hide-mobile">Dashboard</Link>
          
          {!token ? (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Login</Link>
              <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Get Started</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="badge-high badge" style={{ border: 'none', cursor: 'pointer' }}>Logout</button>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .hide-mobile { display: none; }
        }
      `}</style>
    </nav>
  );
}