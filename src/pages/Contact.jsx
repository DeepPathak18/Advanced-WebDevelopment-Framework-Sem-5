import { useState } from "react";

function Contact() {
  const [message, setMessage] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  return (
    <section style={{ padding: "1.5rem" }}>
      <h2>Contact</h2>
      <button
        type="button"
        aria-expanded={showHelp}
        onClick={() => setShowHelp((visible) => !visible)}
      >
        {showHelp ? "Hide help" : "Help"}
      </button>
      {showHelp && (
        <p role="tooltip">Enter a message below to see a live preview.</p>
      )}
      <label htmlFor="message">Your message:</label>
      <br />
      <input
        id="message"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "300px", padding: "0.5rem", marginTop: "0.5rem" }}
      />
      <p>Character count: {message.length}</p>
      <p>Live preview: {message}</p>
    </section>
  );
}

export default Contact;