function Skills({ skillList }) {
  return (
    <section>
      <h2>Skills</h2>
      <ul className="skills-list">
        {skillList.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;