"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Világos mód bekapcsolása" : "Sötét mód bekapcsolása"}
    >
      {mounted ? (isDark ? "Világos mód" : "Sötét mód") : "Téma"}
    </button>
  );
}