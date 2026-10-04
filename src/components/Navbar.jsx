import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const linkStyle = (path) => ({
    marginRight: "1rem",
    fontWeight: location.pathname === path ? "bold" : "normal",
    color: location.pathname === path ? "#2563eb" : "var(--text-color)",
    textDecoration: "none",
  });

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    document.documentElement.classList.toggle("dark", nextIsDark);
    setIsDark(nextIsDark);
  };

  return (
    <nav className="site-nav" style={{ padding: "1rem", borderBottom: "1px solid var(--border-color)" }}>
      <Link to="/" style={linkStyle("/")}>Home</Link>
      <Link to="/projects" style={linkStyle("/projects")}>Projects</Link>
      <Link to="/github" style={linkStyle("/github")}>GitHub Repos</Link>
      <Link to="/tasks" style={linkStyle("/tasks")}>Tasks</Link>
      <Link to="/contact" style={linkStyle("/contact")}>Contact</Link>
      <button type="button" onClick={toggleTheme}>
        Switch to {isDark ? "light" : "dark"} mode
      </button>
    </nav>
  );
}

export default NavBar;