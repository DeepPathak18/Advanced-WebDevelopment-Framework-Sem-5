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
    <section>
      <h2>My Projects</h2>
      <ul className="project-list">
        {projects.map((project) => (
          <li key={project.title}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default MyProjects;
