import { useState, useEffect, useRef } from "react";
import Timer from "./components/Timer";
import Settings from "./components/Settings";
import TaskList from "./components/TaskList";
import Stats from "./components/Stats";
import AuthModal from "./components/AuthModal";
import { supabase } from "./supabase";
import useTheme from "./hooks/useTheme";
import "./index.css";

const STORAGE_KEY = "focus_app_settings";
const TASK_KEY = "focus_active_task";

export default function App() {
  // AUTH
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  // Load session on app start
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // THEME
  const [theme, setTheme] = useTheme();

  // SETTINGS
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");

  const baseDefaults = {
    pomodoro: saved?.defaults?.pomodoro ?? 25 * 60,
    short: saved?.defaults?.short ?? 5 * 60,
    long: saved?.defaults?.long ?? 15 * 60,
  };

  const [defaults, setDefaults] = useState(baseDefaults);
  const [soundOn, setSoundOn] = useState(saved?.meta?.sound ?? true);
  const [autoSwitch, setAutoSwitch] = useState(saved?.meta?.autoSwitch ?? true);
  const [showSettings, setShowSettings] = useState(false);

  // ACTIVE TASK (synced with Supabase inside TaskList)
  const [activeTaskId, setActiveTaskId] = useState(
    Number(localStorage.getItem(TASK_KEY)) || null
  );

  useEffect(() => {
    if (activeTaskId) localStorage.setItem(TASK_KEY, activeTaskId);
  }, [activeTaskId]);

  // SOUND
  const audioRef = useRef(
    typeof Audio !== "undefined" ? new Audio("/ding.mp3") : null
  );

  // SAVE SETTINGS
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ defaults, meta: { sound: soundOn, autoSwitch } })
    );
  }, [defaults, soundOn, autoSwitch]);

  // NOTIFICATION PERMISSION
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // RECORD SESSION
  const recordSession = (mode) => {
    const key = "focus_app_sessions";
    const raw = JSON.parse(localStorage.getItem(key) || "[]");
    raw.push({ ts: Date.now(), mode });
    localStorage.setItem(key, JSON.stringify(raw));
  };

  // SESSION END (sound + notification + track pomodoro count)
  const handleSessionEnd = (mode) => {
    // sound
    if (soundOn && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    // notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(
        mode === "pomodoro" ? "Work session finished" : "Break finished",
        {
          body:
            mode === "pomodoro" ? "Take a short break!" : "Back to focus mode.",
        }
      );
    }

    // statistics
    recordSession(mode);

    // auto pomodoro update (TaskList handles DB update)
    if (mode === "pomodoro" && activeTaskId) {
      const tasks = JSON.parse(localStorage.getItem("focus_app_tasks") || "[]");
      const updated = tasks.map((t) =>
        t.id === activeTaskId
          ? { ...t, completedPomodoros: t.completedPomodoros + 1 }
          : t
      );
      localStorage.setItem("focus_app_tasks", JSON.stringify(updated));
    }
  };

  const handleSaveSettings = (newDefaults, meta) => {
    setDefaults(newDefaults);
    setSoundOn(meta.sound);
    setAutoSwitch(meta.autoSwitch);
    setShowSettings(false);
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center py-10"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      {/* HEADER */}
      <div className="mb-6 flex items-center gap-4">
        <h1 className="text-3xl font-bold" style={{ color: "var(--primary)" }}>
          Focus Timer
        </h1>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="px-4 py-2 rounded border border-neutral-300"
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {/* Settings */}
        <button
          onClick={() => setShowSettings((s) => !s)}
          className="px-4 py-2 rounded border border-neutral-300"
        >
          ⚙ Settings
        </button>

        {/* Login / Logout */}
        {!user ? (
          <button
            onClick={() => setAuthOpen(true)}
            className="px-4 py-2 rounded border border-neutral-300"
          >
            Login / Signup
          </button>
        ) : (
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-4 py-2 rounded border border-neutral-300"
          >
            Logout
          </button>
        )}
      </div>
      {/* TIMER */}
      <Timer
        defaults={defaults}
        autoSwitch={autoSwitch}
        onSessionEnd={handleSessionEnd}
      />
      {/* SETTINGS PANEL */}
      {showSettings && (
        <div className="mt-6">
          <Settings
            defaults={defaults}
            onSave={handleSaveSettings}
            initial={{ sound: soundOn, autoSwitch }}
          />
        </div>
      )}
     
     { /* TASKS: works offline, syncs only when logged in */}
      <div className="mt-10">
        <TaskList user={user} onUseTask={setActiveTaskId} />

        {!user && (
          <p className="text-center opacity-60 mt-2">
            (Login to sync tasks online 🔄 — Local tasks work offline)
          </p>
        )}
      </div>
      
      {/* STATS */}
      <div className="mt-10">
        <Stats />
      </div>
      {/* AUTH MODAL */}
      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onAuth={(u) => setUser(u)}
        />
      )}
    </div>
  );
}
