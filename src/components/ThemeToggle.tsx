"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { setThemeCookie } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="size-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    setThemeCookie(next);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
