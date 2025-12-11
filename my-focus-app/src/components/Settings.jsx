import { useState } from "react";

export default function Settings({ defaults, onSave, initial }) {
  const [pomodoro, setPomodoro] = useState(defaults.pomodoro / 60);
  const [short, setShort] = useState(defaults.short / 60);
  const [long, setLong] = useState(defaults.long / 60);
  const [sound, setSound] = useState(initial.sound);
  const [autoSwitch, setAutoSwitch] = useState(initial.autoSwitch);

  const save = () => {
    onSave(
      {
        pomodoro: pomodoro * 60,
        short: short * 60,
        long: long * 60,
      },
      { sound, autoSwitch }
    );
  };

  return (
    <div
      className="p-6 rounded-xl card w-80"
      style={{
        background: "var(--card)",
        color: "var(--text)",
        border: "1px solid var(--border)",
      }}
    >
      <h2
        className="text-xl font-semibold mb-4"
        style={{ color: "var(--primary)" }}
      >
        Settings
      </h2>

      {/* Time Inputs */}
      <div className="space-y-3 mb-5">
        <div className="flex justify-between items-center">
          <span>Pomodoro</span>
          <input
            type="number"
            min="1"
            className="w-20 p-2 rounded border"
            style={{
              background: "var(--card)",
              color: "var(--text)",
              borderColor: "var(--border)",
            }}
            value={pomodoro}
            onChange={(e) => setPomodoro(Number(e.target.value))}
          />
        </div>

        <div className="flex justify-between items-center">
          <span>Short Break</span>
          <input
            type="number"
            min="1"
            className="w-20 p-2 rounded border"
            style={{
              background: "var(--card)",
              color: "var(--text)",
              borderColor: "var(--border)",
            }}
            value={short}
            onChange={(e) => setShort(Number(e.target.value))}
          />
        </div>

        <div className="flex justify-between items-center">
          <span>Long Break</span>
          <input
            type="number"
            min="1"
            className="w-20 p-2 rounded border"
            style={{
              background: "var(--card)",
              color: "var(--text)",
              borderColor: "var(--border)",
            }}
            value={long}
            onChange={(e) => setLong(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 mb-5">
        <label className="flex items-center justify-between">
          <span>Sound</span>
          <input
            type="checkbox"
            checked={sound}
            onChange={() => setSound((s) => !s)}
          />
        </label>

        <label className="flex items-center justify-between">
          <span>Auto Switch</span>
          <input
            type="checkbox"
            checked={autoSwitch}
            onChange={() => setAutoSwitch((s) => !s)}
          />
        </label>
      </div>

      {/* Save Button */}
      <button
        onClick={save}
        className="w-full p-2 rounded-lg text-white"
        style={{ background: "var(--primary)" }}
      >
        Save
      </button>
    </div>
  );
}
