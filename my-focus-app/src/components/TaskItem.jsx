export default function TaskItem({ task, onToggle, onDelete }) {
  const handleToggle = () => {
    onToggle(task.id, !task.completed);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  return (
    <div
      className="task-item flex items-center justify-between p-3 rounded mb-2"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        color: "var(--text)",
      }}
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          aria-label={`Mark "${task.text}" as ${
            task.completed ? "incomplete" : "complete"
          }`}
          style={{
            width: "18px",
            height: "18px",
            accentColor: "var(--primary)",
          }}
        />

        <span
          className={task.completed ? "done" : ""}
          style={{
            textDecoration: task.completed ? "line-through" : "none",
            opacity: task.completed ? 0.6 : 1,
          }}
        >
          {task.text}
        </span>
      </div>

      <button
        onClick={handleDelete}
        className="delete-btn px-2"
        aria-label={`Delete task "${task.text}"`}
        style={{
          color: "var(--text)",
          opacity: 0.7,
        }}
      >
        ✕
      </button>
    </div>
  );
}
