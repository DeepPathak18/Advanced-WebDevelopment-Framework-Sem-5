import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing-shell">
      <section className="landing-hero">
        <div className="landing-copy">
          <p className="landing-eyebrow">Student workspace</p>
          <h2>A simple place to learn, build, and stay organized.</h2>
          <p>
            Sign in to access your portfolio pages, GitHub projects, and personal
            task manager. New here? Create an account to get started.
          </p>
          <div className="landing-actions">
            <Link className="landing-button" to="/login">Login</Link>
            <Link className="landing-button secondary" to="/register">Create account</Link>
          </div>
        </div>
        <div className="landing-preview" aria-label="Workspace preview">
          <div className="preview-topbar"><span /><span /><span /></div>
          <p className="preview-label">MY WORKSPACE</p>
          <h3>Ready for your next idea?</h3>
          <div className="preview-row"><span className="preview-check">✓</span> Build your portfolio</div>
          <div className="preview-row"><span className="preview-check">✓</span> Explore your projects</div>
          <div className="preview-row"><span className="preview-empty" /> Keep tasks in one place</div>
          <div className="preview-progress"><span /></div>
          <small>Your workspace starts after login</small>
        </div>
      </section>
      <section className="landing-features" aria-label="Workspace features">
        <article>
          <span className="feature-number">01</span>
          <h3>Your portfolio</h3>
          <p>Keep your student profile, skills, and work together.</p>
        </article>
        <article>
          <span className="feature-number">02</span>
          <h3>Your projects</h3>
          <p>Browse repository details and see your work at a glance.</p>
        </article>
        <article>
          <span className="feature-number">03</span>
          <h3>Your tasks</h3>
          <p>Track what you need to do and mark completed work.</p>
        </article>
      </section>
      <footer className="landing-footer">
        <span>STUDENT PORTFOLIO</span>
        <span>Sign in to continue to your workspace</span>
      </footer>
    </div>
  );
}

export default Landing;
