// src/utils/localTasks.js
const KEY = "focus_app_tasks";

export function getLocalTasks() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveLocalTasks(tasks) {
  localStorage.setItem(KEY, JSON.stringify(tasks));
}

export function clearLocalTasks() {
  localStorage.removeItem(KEY);
}
