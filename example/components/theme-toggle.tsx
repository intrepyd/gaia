import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme";

export function ThemeToggle() {
  const { setTheme, systemTheme } = useTheme();

  return (
    <button
      className="inline-flex mb-1"
      onClick={() => setTheme(systemTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
