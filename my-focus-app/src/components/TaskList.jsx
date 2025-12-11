// src/components/TaskList.jsx
import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";
import {
  getLocalTasks,
  saveLocalTasks,
  clearLocalTasks,
} from "../utils/localTasks";

export default function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [estimate, setEstimate] = useState(1);
  const syncingRef = useRef(false);

  // Load tasks
  useEffect(() => {
    if (!user) {
      setTasks(getLocalTasks());
      return;
    }

    (async () => {
      if (syncingRef.current) return;
      syncingRef.current = true;

      // sync local → supabase
      const local = getLocalTasks();
      if (local.length > 0) {
        const toInsert = local.map((t) => ({
          title: t.title,
          estimate: t.estimate ?? 1,
          done: t.done ?? false,
          completed_pomodoros: t.completed_pomodoros ?? 0,
          user_id: user.id,
        }));

        const { error } = await supabase.from("tasks").insert(toInsert);
        if (!error) clearLocalTasks();
      }

      await loadSupabaseTasks();
      setupRealtime();
      syncingRef.current = false;
    })();
  }, [user]);

  // Load supabase tasks
  const loadSupabaseTasks = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) setTasks(data || []);
  };

  // Realtime sync
  let channelRef = useRef(null);
  const setupRealtime = () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel("tasks-sync-" + user.id)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${user.id}`,
        },
        loadSupabaseTasks
      )
      .subscribe();

    channelRef.current = channel;
  };

  // Add Task
  const add = async () => {
    if (!title.trim()) return;

    if (!user) {
      const newTask = {
        id: Date.now(),
        title,
        estimate,
        done: false,
        completed_pomodoros: 0,
        created_at: new Date().toISOString(),
      };
      const updated = [newTask, ...tasks];
      setTasks(updated);
      saveLocalTasks(updated);
    } else {
      const { error } = await supabase.from("tasks").insert({
        title,
        estimate,
        done: false,
        completed_pomodoros: 0,
        user_id: user.id,
      });

      if (!error) await loadSupabaseTasks();
    }

    setTitle("");
    setEstimate(1);
  };

  // Toggle Done
  const toggleDone = async (id, done) => {
    if (!user) {
      const updated = tasks.map((t) => (t.id === id ? { ...t, done } : t));
      setTasks(updated);
      saveLocalTasks(updated);
    } else {
      await supabase.from("tasks").update({ done }).eq("id", id);
      loadSupabaseTasks();
    }
  };

  // Delete
  const remove = async (id) => {
    if (!user) {
      const updated = tasks.filter((t) => t.id !== id);
      setTasks(updated);
      saveLocalTasks(updated);
    } else {
      await supabase.from("tasks").delete().eq("id", id);
      loadSupabaseTasks();
    }
  };

  // Increment pomodoro
  const incPomodoro = async (id, current) => {
    if (!user) {
      const updated = tasks.map((t) =>
        t.id === id ? { ...t, completed_pomodoros: current + 1 } : t
      );
      setTasks(updated);
      saveLocalTasks(updated);
    } else {
      await supabase
        .from("tasks")
        .update({ completed_pomodoros: current + 1 })
        .eq("id", id);
      loadSupabaseTasks();
    }
  };

  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold">
        {user ? "Your Synced Tasks" : "Your Local Tasks"}
      </h3>

      {/* Add Task */}
      <div className="flex gap-2 mb-3">
        <input
          className="flex-1 p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task"
        />

        <input
          type="number"
          min="1"
          className="w-16 p-2 border rounded"
          value={estimate}
          onChange={(e) => setEstimate(Number(e.target.value))}
        />

        <button onClick={add} className="px-3 rounded text-white bg-blue-500">
          Add
        </button>
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {tasks.map((t) => (
          <div key={t.id} className="flex justify-between p-2 border rounded">
            <div>
              <div className={t.done ? "line-through opacity-70" : ""}>
                {t.title}
              </div>
              <div className="text-xs opacity-75">
                Est: {t.estimate} | Done: {t.completed_pomodoros}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => incPomodoro(t.id, t.completed_pomodoros)}>
                +
              </button>
              <button onClick={() => toggleDone(t.id, !t.done)}>✓</button>
              <button onClick={() => remove(t.id)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
