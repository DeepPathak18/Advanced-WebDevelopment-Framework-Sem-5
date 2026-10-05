import { useCallback, useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/Errormsg";
import RepoList from "../components/RepoList";

const GITHUB_USERNAME = "DeepPathak18";

async function fetchRepos() {
  const response = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos`
  );
  if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
  return response.json();
}

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const retryFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRepos(await fetchRepos());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadRepos = async () => {
      try {
        const data = await fetchRepos();
        if (active) setRepos(data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadRepos();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} onRetry={retryFetch} />;

  const filteredRepos = repos.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="page-section">
      <h2>GitHub Repositories</h2>
      <input
        type="text"
        placeholder="Search repos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="repo-search"
      />
      <RepoList data={filteredRepos} />
    </section>
  );
}

export default Projects;