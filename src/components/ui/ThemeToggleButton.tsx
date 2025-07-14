"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const [currentIcon, setCurrentIcon] = React.useState(theme);

  React.useEffect(() => {
    setCurrentIcon(theme);
  }, [theme]);

  const themes = ["light", "dark", "system"];
  
  const toggleTheme = () => {
    const currentIndex = themes.indexOf(theme || "system");
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    setTheme(nextTheme);
  };

  const getIcon = (iconTheme?: string) => {
    switch (iconTheme) {
      case "light":
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem]" />;
      default:
        return <Settings2 className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="group relative h-10 w-10 overflow-hidden rounded-full text-foreground/70 transition-colors hover:bg-accent/50 hover:text-accent-foreground"
    >
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out",
          "transform-gpu group-hover:scale-110"
        )}
      >
        <div
          key={currentIcon}
          className="animate-in fade-in-0 zoom-in-90 rotate-0"
        >
          {getIcon(currentIcon)}
        </div>
      </div>
       <div
        className="absolute inset-0 scale-0 rounded-full bg-primary/30 opacity-0 transition-all duration-300 ease-in-out group-active:scale-100 group-active:opacity-100"
      />
    </Button>
  );
}
