import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    document.documentElement.classList.toggle("dark", nextIsDark);
    setIsDark(nextIsDark);
  };

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <Link to="/" className={`nav-link${location.pathname === "/" ? " active" : ""}`}>Home</Link>
      <Link to="/projects" className={`nav-link${location.pathname === "/projects" ? " active" : ""}`}>Projects</Link>
      <Link to="/github" className={`nav-link${location.pathname === "/github" ? " active" : ""}`}>GitHub Repos</Link>
      <Link to="/tasks" className={`nav-link${location.pathname === "/tasks" ? " active" : ""}`}>Tasks</Link>
      <Link to="/contact" className={`nav-link${location.pathname === "/contact" ? " active" : ""}`}>Contact</Link>
      <button className="theme-toggle" type="button" onClick={toggleTheme}>
        Switch to {isDark ? "light" : "dark"} mode
      </button>
    </nav>
  );
}

export default NavBar;