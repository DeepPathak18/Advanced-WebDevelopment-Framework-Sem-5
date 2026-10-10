function Spinner({ message = "Loading..." }) {
  return (
    <div style={{ padding: "1.5rem", textAlign: "center" }}>
      <p>{message}</p>
    </div>
  );
}

export default Spinner;