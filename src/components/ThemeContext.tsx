"use client";

import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from "@mui/material";

type Mode = "light" | "dark";

export type ColorTheme = "blue" | "purple" | "teal" | "amber" | "rose";

export const COLOR_THEMES: {
  id: ColorTheme;
  label: string;
  light: string;
  dark: string;
}[] = [
  { id: "blue",   label: "Ocean",   light: "#3b82f6", dark: "#60a5fa" },
  { id: "purple", label: "Grape",   light: "#8b5cf6", dark: "#a78bfa" },
  { id: "teal",   label: "Forest",  light: "#14b8a6", dark: "#2dd4bf" },
  { id: "amber",  label: "Sunset",  light: "#f59e0b", dark: "#fbbf24" },
  { id: "rose",   label: "Cherry",  light: "#f43f5e", dark: "#fb7185" },
];

const ThemeContext = createContext<{
  mode: Mode;
  toggleMode: () => void;
  colorTheme: ColorTheme;
  setColorTheme: (t: ColorTheme) => void;
}>({
  mode: "light",
  toggleMode: () => {},
  colorTheme: "blue",
  setColorTheme: () => {},
});

export function useThemeMode() {
  return useContext(ThemeContext);
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("light");
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("blue");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("theme-mode") as Mode | null;
    if (savedMode === "dark" || savedMode === "light") {
      setMode(savedMode);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setMode("dark");
    }

    const savedColor = localStorage.getItem("color-theme") as ColorTheme | null;
    if (savedColor && COLOR_THEMES.some((t) => t.id === savedColor)) {
      setColorThemeState(savedColor);
    }

    setMounted(true);
  }, []);

  function toggleMode() {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme-mode", next);
      return next;
    });
  }

  function setColorTheme(t: ColorTheme) {
    setColorThemeState(t);
    localStorage.setItem("color-theme", t);
  }

  const theme = useMemo(() => {
    const palette = COLOR_THEMES.find((t) => t.id === colorTheme) ?? COLOR_THEMES[0];
    const primaryColor = mode === "light" ? palette.light : palette.dark;

    return createTheme({
      palette: {
        mode,
        primary: { main: primaryColor },
        ...(mode === "light"
          ? { background: { default: "#f8fafc", paper: "#ffffff" } }
          : { background: { default: "#0f172a", paper: "#1e293b" } }),
      },
      typography: {
        fontFamily: "var(--font-geist-sans), sans-serif",
      },
      shape: {
        borderRadius: 10,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
              fontWeight: 600,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
            },
          },
        },
      },
    });
  }, [mode, colorTheme]);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, colorTheme, setColorTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
