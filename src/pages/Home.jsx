import About from "../components/About";
import Skills from "../components/Skills";
import MyProjects from "../components/MyProjects";

function Home() {
  const skillList = ["JavaScript", "React", "Node.js", "MongoDB", "Python"];

  return (
    <div>
      <About />
      <Skills skillList={skillList} />
      <MyProjects />
    </div>
  );
}

export default Home;