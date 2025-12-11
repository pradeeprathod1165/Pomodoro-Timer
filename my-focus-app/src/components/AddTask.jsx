import { useState } from "react";

export default function AddTask({ onAdd }) {
  const [text, setText] = useState("");
  const [estimate, setEstimate] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd({ text: text.trim(), estimate: Number(estimate) });
    setText("");
    setEstimate(1);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 mb-3 p-3 rounded"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <input
        type="text"
        placeholder="Add new task..."
        className="flex-1 p-2 rounded outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          background: "var(--card)",
          color: "var(--text)",
          border: "1px solid var(--border)",
          caretColor: "var(--text)",
        }}
      />

      <input
        type="number"
        min="1"
        className="w-20 p-2 rounded outline-none"
        value={estimate}
        onChange={(e) => setEstimate(e.target.value)}
        style={{
          background: "var(--card)",
          color: "var(--text)",
          border: "1px solid var(--border)",
          caretColor: "var(--text)",
        }}
      />

      <button
        type="submit"
        className="px-4 py-2 rounded text-white"
        style={{
          background: "var(--primary)",
        }}
      >
        Add
      </button>
    </form>
  );
}
