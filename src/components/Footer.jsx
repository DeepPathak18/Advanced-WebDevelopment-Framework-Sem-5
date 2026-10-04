function Footer() {
  return (
    <footer style={{ padding: "1rem", textAlign: "center", background: "var(--border-color)" }}>
      <p>© {new Date().getFullYear()} My Portfolio — Built with React</p>
    </footer>
  );
}

export default Footer;