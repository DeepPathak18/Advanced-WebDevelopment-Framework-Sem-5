import { useEffect } from "react";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timeout = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(timeout);
  }, [message, onClose]);

  return (
    <div className={`toast toast-${type}`} role={type === "error" ? "alert" : "status"}>
      <span>{message}</span>
      <button type="button" aria-label="Dismiss notification" onClick={onClose}>
        ×
      </button>
    </div>
  );
}

export default Toast;
