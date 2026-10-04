import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main style={{ padding: "1.5rem" }}>
      <h2>Page not found</h2>
      <p>The page you requested does not exist.</p>
      <Link to="/">Return to Home</Link>
    </main>
  );
}

export default NotFound;
