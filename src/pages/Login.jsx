import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ErrorMessage from "../components/Errormsg";
import { login } from "../api";

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const statusMessage = params.get("message");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    statusMessage === "session-expired"
      ? "Session expired, please log in again."
      : statusMessage === "registered"
        ? "Registration successful. Please log in."
        : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = await login(email, password);
      onLoginSuccess(data.user);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-section auth-section">
      <h2>Login</h2>

      {error && <ErrorMessage message={error} />}

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        Need an account? <Link to="/register">Register here</Link>
      </p>
    </section>
  );
}

export default Login;
