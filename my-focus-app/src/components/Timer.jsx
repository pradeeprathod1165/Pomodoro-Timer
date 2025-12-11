import { useState, useEffect, useRef } from "react";

const DEFAULTS = {
  pomodoro: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

export default function Timer({
  defaults = DEFAULTS,
  autoSwitch = true,
  onSessionEnd = () => {},
}) {
  const [mode, setMode] = useState("pomodoro");
  const [time, setTime] = useState(defaults[mode]);
  const [isRunning, setIsRunning] = useState(false);
  const completedPomodoros = useRef(0);

  // CLICK SOUND
  const clickSound = useRef(null);
  useEffect(() => {
    clickSound.current = new Audio("/sounds/click.mp3"); // put mp3 in public/sounds folder
  }, []);

  const playClick = () => {
    if (clickSound.current) {
      clickSound.current.currentTime = 0;
      clickSound.current.play();
    }
  };

  // Sync time when mode changes
  useEffect(() => {
    setTime(defaults[mode]);
    setIsRunning(false);
  }, [mode, defaults]);

  // Timer tick
  useEffect(() => {
    if (!isRunning) return;

    if (time <= 0) {
      setIsRunning(false);
      handleSessionComplete();
      return;
    }

    const id = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, time]);

  const handleSessionComplete = () => {
    onSessionEnd(mode);

    if (!autoSwitch) return;

    if (mode === "pomodoro") {
      completedPomodoros.current += 1;
      setMode(completedPomodoros.current % 4 === 0 ? "long" : "short");
    } else {
      setMode("pomodoro");
    }
  };

  const toggleStart = () => {
    playClick();
    setIsRunning((r) => !r);
  };

  const reset = () => {
    playClick();
    setIsRunning(false);
    setTime(defaults[mode]);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m < 10 ? "0" : ""}${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div
      className="w-full max-w-md p-8 rounded-xl flex flex-col items-center"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--primary-light)",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      }}
    >
      <div className="flex gap-3 mb-6">
        {[
          { id: "pomodoro", label: "Pomodoro" },
          { id: "short", label: "Short Break" },
          { id: "long", label: "Long Break" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              playClick();
              setMode(t.id);
            }}
            className="px-4 py-2 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: mode === t.id ? "var(--primary)" : "transparent",
              color: mode === t.id ? "white" : "var(--text)",
              border: mode === t.id ? "none" : "1px solid var(--primary-light)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <h1
        className="text-6xl font-bold tracking-wide mb-6"
        style={{ color: "var(--primary)" }}
      >
        {formatTime(time)}
      </h1>

      <div className="flex gap-4">
        <button
          onClick={toggleStart}
          className="px-8 py-2 rounded-lg text-lg font-semibold"
          style={{
            backgroundColor: "var(--primary)",
            color: "white",
            boxShadow: "0 6px 15px rgba(74,108,247,0.35)",
          }}
        >
          {isRunning ? "Pause" : "Start"}
        </button>

        <button
          onClick={reset}
          className="px-5 py-2 rounded-lg border"
          style={{ borderColor: "var(--primary-light)", color: "var(--text)" }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
