function Header({ name, themeColor = "#2563eb" }) {
  return (
    <header style={{ backgroundColor: themeColor, color: "#fff", padding: "1.5rem" }}>
      <h1>{name}</h1>
      <p>Computer Science & Engineering Student</p>
    </header>
  );
}

export default Header;