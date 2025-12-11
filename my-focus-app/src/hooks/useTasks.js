import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export function useTasks(userId) {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks
  async function loadTasks() {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at");

    setTasks(data || []);
  }

  // Add task
  async function addTask(text) {
    await supabase.from("tasks").insert({
      text,
      completed: false,
      user_id: userId,
    });
  }

  // Update
  async function toggleTask(id, completed) {
    await supabase.from("tasks").update({ completed }).eq("id", id);
  }

  // Delete
  async function deleteTask(id) {
    await supabase.from("tasks").delete().eq("id", id);
  }

  // Realtime Sync
  useEffect(() => {
    if (!userId) return;

    loadTasks();

    const channel = supabase
      .channel("tasks-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        loadTasks
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId]);

  return { tasks, addTask, toggleTask, deleteTask };
}
