function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{ padding: "1.5rem", color: "#b91c1c" }}>
      <p>Something went wrong: {message}</p>
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  );
}

export default ErrorMessage;