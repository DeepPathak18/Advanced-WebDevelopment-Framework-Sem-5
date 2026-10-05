import { useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "../api";
import ErrorMessage from "../components/Errormsg";
import Spinner from "../components/Spinner";
import Toast from "../components/Toast";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [busyAction, setBusyAction] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let active = true;

    const loadTasks = async () => {
      try {
        const data = await getTasks();
        if (active) setTasks(data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadTasks();
    return () => {
      active = false;
    };
  }, []);

  const reloadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      setTasks(await getTasks());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    const title = newTitle.trim();
    if (!title || busyAction) return;

    const temporaryId = `temporary-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const optimisticTask = {
      _id: temporaryId,
      title,
      completed: false,
      priority: "medium",
    };

    setTasks((currentTasks) => [...currentTasks, optimisticTask]);
    setNewTitle("");
    setBusyAction("create");
    try {
      const createdTask = await createTask({ title });
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === temporaryId ? createdTask : task
        )
      );
      setToast({ type: "success", message: "Task created successfully." });
    } catch (err) {
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== temporaryId)
      );
      setNewTitle(title);
      setToast({ type: "error", message: `Could not create task: ${err.message}` });
    } finally {
      setBusyAction(null);
    }
  };

  const handleToggleComplete = async (task) => {
    if (busyAction) return;
    setBusyAction(`update-${task._id}`);
    try {
      const updatedTask = await updateTask(task._id, {
        completed: !task.completed,
      });
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask._id === updatedTask._id ? updatedTask : currentTask
        )
      );
      setToast({ type: "success", message: "Task updated successfully." });
    } catch (err) {
      setToast({ type: "error", message: `Could not update task: ${err.message}` });
    } finally {
      setBusyAction(null);
    }
  };

  const handleDelete = async (id) => {
    if (busyAction || !window.confirm("Delete this task?")) return;
    setBusyAction(`delete-${id}`);
    try {
      await deleteTask(id);
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== id)
      );
      setToast({ type: "success", message: "Task deleted successfully." });
    } catch (err) {
      setToast({ type: "error", message: `Could not delete task: ${err.message}` });
    } finally {
      setBusyAction(null);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} onRetry={reloadTasks} />;

  return (
    <section className="page-section">
      <h2>Tasks</h2>

      <form className="task-form" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="New task title..."
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          disabled={busyAction !== null}
          className="task-input"
        />
        <button type="submit" disabled={busyAction !== null || !newTitle.trim()}>
          {busyAction === "create" ? "Saving..." : "Add Task"}
        </button>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ul className="task-list">
        {tasks.map((task) => {
          const updating = busyAction === `update-${task._id}`;
          const deleting = busyAction === `delete-${task._id}`;

          return (
            <li key={task._id}>
              <label
                className="task-label"
                style={{ textDecoration: task.completed ? "line-through" : "none" }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  disabled={busyAction !== null || task._id.startsWith("temporary-")}
                  onChange={() => handleToggleComplete(task)}
                />{" "}
                {task.title}
              </label>{" "}
              <button
                className="delete-button"
                type="button"
                disabled={busyAction !== null}
                onClick={() => handleDelete(task._id)}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
              {updating && <span role="status"> Updating...</span>}
              {task._id.startsWith("temporary-") && (
                <span role="status"> Saving...</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Tasks;
