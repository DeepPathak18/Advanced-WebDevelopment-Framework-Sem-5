import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function NavBar({ isAuthenticated, userEmail, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    document.documentElement.classList.toggle("dark", nextIsDark);
    setIsDark(nextIsDark);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <Link
        to={isAuthenticated ? "/home" : "/"}
        className={`nav-link${location.pathname === "/" || location.pathname === "/home" ? " active" : ""}`}
      >
        Home
      </Link>

      {isAuthenticated ? (
        <>
          <Link to="/portfolio" className={`nav-link${location.pathname === "/portfolio" ? " active" : ""}`}>Portfolio</Link>
          <Link to="/github" className={`nav-link${location.pathname === "/github" ? " active" : ""}`}>GitHub Repos</Link>
          <Link to="/tasks" className={`nav-link${location.pathname === "/tasks" ? " active" : ""}`}>Tasks</Link>
          <Link to="/contact" className={`nav-link${location.pathname === "/contact" ? " active" : ""}`}>Contact</Link>
          {userEmail && <span className="nav-user">{userEmail}</span>}
          <button className="theme-toggle" type="button" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className={`nav-link${location.pathname === "/login" ? " active" : ""}`}>Login</Link>
          <Link to="/register" className={`nav-link${location.pathname === "/register" ? " active" : ""}`}>Register</Link>
        </>
      )}

      <button className="theme-toggle" type="button" onClick={toggleTheme}>
        Switch to {isDark ? "light" : "dark"} mode
      </button>
    </nav>
  );
}

export default NavBar;