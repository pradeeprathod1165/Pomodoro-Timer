import { useTimer } from "../hooks/useTimer";

export default function ModeSwitch() {
  const { setMode, mode } = useTimer();

  const modes = [
    { key: "focus", label: "Focus" },
    { key: "short", label: "Short Break" },
    { key: "long", label: "Long Break" },
  ];

  return (
    <div className="flex justify-center gap-6 mt-3 text-sm">
      {modes.map((m) => (
        <button
          key={m.key}
          onClick={() => setMode(m.key)}
          className={`pb-1 border-b-2 transition ${
            mode === m.key
              ? "border-black"
              : "border-transparent text-neutral-500"
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
