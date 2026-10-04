const projects = [
  {
    title: "Student Portfolio",
    description: "A personal portfolio built with React and reusable components.",
  },
  {
    title: "Task Manager API",
    description: "A REST API for creating and managing tasks with Express and MongoDB.",
  },
  {
    title: "GitHub Repository Explorer",
    description: "A small React app that searches and displays public GitHub repositories.",
  },
];

function MyProjects() {
  return (
    <section style={{ padding: "1.5rem" }}>
      <h2>My Projects</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.title} style={{ marginBottom: "1rem" }}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default MyProjects;
