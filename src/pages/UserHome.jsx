import { Link } from "react-router-dom";

function UserHome({ userEmail }) {
  return (
    <section className="page-section user-home">
      <p className="landing-eyebrow">Personal workspace</p>
      <h2>Welcome{userEmail ? `, ${userEmail}` : " back"}!</h2>
      <p>You are signed in. Choose where you want to continue.</p>
      <div className="project-list">
        <article>
          <h3>Task manager</h3>
          <p>Create, update, and organize your tasks.</p>
          <Link to="/tasks">Open tasks</Link>
        </article>
        <article>
          <h3>Portfolio</h3>
          <p>View the student portfolio and projects.</p>
          <Link to="/portfolio">View portfolio</Link>
        </article>
        <article>
          <h3>GitHub repositories</h3>
          <p>Browse public GitHub repositories.</p>
          <Link to="/github">Explore repositories</Link>
        </article>
      </div>
    </section>
  );
}

export default UserHome;
