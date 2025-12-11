import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { getLocalTasks, saveLocalTasks } from "../utils/localTasks";

export default function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [estimate, setEstimate] = useState(1);

  // Load tasks on mount and when user changes
  useEffect(() => {
    if (!user) {
      setTasks(getLocalTasks());
      return;
    }
    loadSupabaseTasks();

    // Enable realtime sync
    const channel = supabase
      .channel("tasks-sync")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${user.id}`,
        },
        () => loadSupabaseTasks()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  // Load tasks from supabase
  const loadSupabaseTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) setTasks(data || []);
  };

  // ADD TASK
  const add = async () => {
    if (!text.trim()) return;

    if (!user) {
      // Offline mode
      const newTask = {
        id: Date.now(),
        text: text.trim(),
        estimate,
        done: false,
        completed_pomodoros: 0,
      };
      const updated = [newTask, ...tasks];
      setTasks(updated);
      saveLocalTasks(updated);
    } else {
      // Online Supabase
      const { error } = await supabase.from("tasks").insert({
        text: text.trim(),
        estimate,
        done: false,
        completed_pomodoros: 0,
        user_id: user.id,
      });

      if (!error) loadSupabaseTasks();
    }

    setText("");
    setEstimate(1);
  };

  // TOGGLE DONE
  const toggleDone = async (id, done) => {
    if (!user) {
      const updated = tasks.map((t) => (t.id === id ? { ...t, done } : t));
      setTasks(updated);
      saveLocalTasks(updated);
    } else {
      await supabase.from("tasks").update({ done }).eq("id", id);
    }
  };

  // DELETE
  const remove = async (id) => {
    if (!user) {
      const updated = tasks.filter((t) => t.id !== id);
      setTasks(updated);
      saveLocalTasks(updated);
    } else {
      await supabase.from("tasks").delete().eq("id", id);
    }
  };

  // INCREMENT POMODORO
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
          value={text}
          onChange={(e) => setText(e.target.value)}
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
                {t.text}
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
