function RepoList({ data }) {
  return (
    <ul>
      {data.map((repo) => (
        <li key={repo.id}>
          <a href={repo.html_url} target="_blank" rel="noreferrer">
            {repo.name}
          </a>
          {" "}⭐ {repo.stargazers_count}
        </li>
      ))}
    </ul>
  );
}

export default RepoList;