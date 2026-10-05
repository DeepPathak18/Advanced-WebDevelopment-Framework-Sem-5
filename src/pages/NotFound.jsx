import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="page-section">
      <h2>Page not found</h2>
      <p>The page you requested does not exist.</p>
      <Link to="/">Return to Home</Link>
    </section>
  );
}

export default NotFound;
