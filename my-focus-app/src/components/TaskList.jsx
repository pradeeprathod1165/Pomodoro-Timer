import { useState, useEffect } from "react";

const STORAGE_KEY = "focus_app_tasks";

export default function TaskList({ onUseTask }) {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [estimate, setEstimate] = useState(1);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setTasks(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const add = () => {
    if (!text.trim()) return;
    const t = {
      id: Date.now(),
      text: text.trim(),
      estimate,
      done: false,
      completedPomodoros: 0,
    };
    setTasks((s) => [t, ...s]);
    setText("");
    setEstimate(1);
  };

  const toggleDone = (id) => {
    setTasks((s) => s.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const remove = (id) => setTasks((s) => s.filter((t) => t.id !== id));

  const incPomodoro = (id) => {
    setTasks((s) =>
      s.map((t) =>
        t.id === id ? { ...t, completedPomodoros: t.completedPomodoros + 1 } : t
      )
    );
  };

  return (
    <div
      className="w-100 p-4 rounded-lg card"
      style={{ background: "var(--card)", color: "var(--text)" }}
    >
      <h3 className="font-semibold mb-3" style={{ color: "var(--primary)" }}>
        Tasks
      </h3>

      {/* Add Task */}
      <div className="flex gap-2 mb-3">
        <input
          className="flex-1 p-2 border rounded"
          style={{
            background: "var(--card)",
            color: "var(--text)",
            borderColor: "var(--border)",
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New task"
        />
        <input
          type="number"
          min="1"
          className="w-16 p-2 border rounded"
          style={{
            background: "var(--card)",
            color: "var(--text)",
            borderColor: "var(--border)",
          }}
          value={estimate}
          onChange={(e) => setEstimate(Number(e.target.value))}
        />
        <button
          onClick={add}
          className="px-3 rounded text-white"
          style={{ background: "var(--primary)" }}
        >
          Add
        </button>
      </div>

      {/* Task Items */}
      <div className="space-y-2 max-h-72 overflow-auto">
        {tasks.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between p-2 border rounded"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div>
              <div
                className={`text-sm ${t.done ? "line-through opacity-60" : ""}`}
                style={{ color: "var(--text)" }}
              >
                {t.text}
              </div>

              <div className="text-xs" style={{ color: "var(--text)" }}>
                Est: {t.estimate} • Done: {t.completedPomodoros}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <button
                onClick={() => incPomodoro(t.id)}
                title="Add completed pomodoro"
                className="text-sm"
                style={{ color: "var(--primary)" }}
              >
                ➕
              </button>
              <div className="flex gap-1">
                <button
                  onClick={() => toggleDone(t.id)}
                  className="text-xs"
                  style={{ color: "var(--primary)" }}
                >
                  ✓
                </button>
                <button
                  onClick={() => remove(t.id)}
                  className="text-xs"
                  style={{ color: "var(--primary)" }}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
