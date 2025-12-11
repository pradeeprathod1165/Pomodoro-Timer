import { useEffect, useState } from "react";
const KEY = "focus_app_theme";
export default function useTheme() {
  const [theme, setTheme] = useState(localStorage.getItem(KEY) || "light");
  useEffect(() => {
    localStorage.setItem(KEY, theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return [theme, setTheme];
}
