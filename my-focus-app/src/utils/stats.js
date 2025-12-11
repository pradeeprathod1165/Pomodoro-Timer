// when a session completes
function recordSession(mode) {
  // store timestamp + mode
  const key = "focus_app_sessions";
  const raw = JSON.parse(localStorage.getItem(key) || "[]");
  raw.push({ ts: Date.now(), mode });
  localStorage.setItem(key, JSON.stringify(raw));
}
