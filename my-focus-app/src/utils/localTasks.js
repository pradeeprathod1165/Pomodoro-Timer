export function getLocalTasks() {
  return JSON.parse(localStorage.getItem("tasks") || "[]");
}

export function saveLocalTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
