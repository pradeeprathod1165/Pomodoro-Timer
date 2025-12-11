import { useEffect, useState } from "react";

function getLast7DaysCounts() {
  const raw = JSON.parse(localStorage.getItem("focus_app_sessions") || "[]");
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const start = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate()
    ).getTime();
    const end = start + 24 * 60 * 60 * 1000;
    const count = raw.filter((s) => s.ts >= start && s.ts < end).length;
    return { date: d, count };
  });
  return days;
}

export default function Stats() {
  const [days, setDays] = useState([]);
  useEffect(() => setDays(getLast7DaysCounts()), []);

  const max = Math.max(...days.map((d) => d.count), 1);

  return (
    <div
      className="p-4 rounded-lg w-96 card"
      style={{ background: "var(--card)", color: "var(--text)" }}
    >
      <h3 className="font-semibold mb-3" style={{ color: "var(--primary)" }}>
        Stats — last 7 days
      </h3>

      <div className="flex items-end gap-2 h-40">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div
              style={{
                height: `${(d.count / max) * 100}%`,
                background: "var(--primary)",
              }}
              className="w-8 rounded-t"
            ></div>

            <div className="text-xs" style={{ color: "var(--text)" }}>
              {d.date.toLocaleDateString(undefined, { weekday: "short" })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
