import { useState } from "react";

function Contact() {
  const [message, setMessage] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  return (
    <section className="page-section">
      <h2>Contact</h2>
      <div className="contact-controls">
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
      <input
        id="message"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="contact-input"
      />
      <p>Character count: {message.length}</p>
      <p className="contact-preview">Live preview: {message}</p>
      </div>
    </section>
  );
}

export default Contact;