import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "../components/Errormsg";
import { register } from "../api";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailAlreadyRegistered, setEmailAlreadyRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setEmailAlreadyRegistered(false);
    setIsSubmitting(true);

    try {
      await register(email, password);
      navigate("/login?message=registered");
    } catch (err) {
      setError(err.message);
      setEmailAlreadyRegistered(err.status === 409);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-section auth-section">
      <h2>Register</h2>

      {error && <ErrorMessage message={error} />}
      {emailAlreadyRegistered && (
        <p>
          This email already has an account. <Link to="/login">Log in instead</Link>.
        </p>
      )}

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
            placeholder="At least 6 characters"
            minLength={6}
            required
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </section>
  );
}

export default Register;
