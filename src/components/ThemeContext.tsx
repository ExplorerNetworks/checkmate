"use client";

import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline, alpha } from "@mui/material";

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
    const isDark = mode === "dark";

    return createTheme({
      palette: {
        mode,
        primary: { main: primaryColor },
        ...(isDark
          ? { background: { default: "#06080f", paper: "#111827" } }
          : { background: { default: "#f0f4ff", paper: "#ffffff" } }),
      },
      typography: {
        fontFamily: "var(--font-body), 'Inter', sans-serif",
        h1: { fontFamily: "var(--font-display), 'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: "-0.02em" },
        h2: { fontFamily: "var(--font-display), 'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: "-0.02em" },
        h3: { fontFamily: "var(--font-display), 'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: "-0.01em" },
        h4: { fontFamily: "var(--font-display), 'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: "-0.01em" },
        h5: { fontFamily: "var(--font-display), 'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: "-0.01em" },
        h6: { fontFamily: "var(--font-display), 'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: "-0.01em" },
        subtitle1: { fontFamily: "var(--font-display), 'Space Grotesk', sans-serif", fontWeight: 600 },
        subtitle2: { fontFamily: "var(--font-display), 'Space Grotesk', sans-serif", fontWeight: 600 },
        button: { fontFamily: "var(--font-display), 'Space Grotesk', sans-serif", fontWeight: 600, letterSpacing: "0.01em" },
      },
      shape: {
        borderRadius: 14,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 12,
            },
            contained: {
              boxShadow: `0 4px 14px ${alpha(primaryColor, 0.35)}`,
              "&:hover": {
                boxShadow: `0 6px 20px ${alpha(primaryColor, 0.45)}`,
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
              backdropFilter: "blur(12px)",
              background: isDark
                ? "rgba(17, 24, 39, 0.7)"
                : "rgba(255, 255, 255, 0.7)",
              boxShadow: isDark
                ? `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`
                : `0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)`,
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
              backdropFilter: "blur(16px) saturate(1.8)",
              background: isDark
                ? "rgba(17, 24, 39, 0.75)"
                : "rgba(255, 255, 255, 0.75)",
              borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              boxShadow: isDark
                ? "0 4px 30px rgba(0,0,0,0.3)"
                : "0 4px 30px rgba(0,0,0,0.04)",
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              "& .MuiInputLabel-root": {
                backgroundColor: isDark ? "#111827" : "#ffffff",
                paddingInline: "4px",
                borderRadius: 4,
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: 12,
                backdropFilter: "blur(8px)",
                background: isDark
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(0,0,0,0.02)",
                "& fieldset": {
                  borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                },
                "&:hover fieldset": {
                  borderColor: primaryColor,
                },
                "&.Mui-focused fieldset": {
                  borderColor: primaryColor,
                  boxShadow: `0 0 0 3px ${alpha(primaryColor, 0.15)}`,
                },
              },
            },
          },
        },
        MuiLinearProgress: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              height: 7,
              backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
            },
            bar: {
              borderRadius: 8,
              backgroundImage: `linear-gradient(90deg, ${primaryColor}, ${alpha(primaryColor, 0.7)})`,
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              fontFamily: "var(--font-display), 'Space Grotesk', sans-serif",
              fontWeight: 600,
              borderRadius: 8,
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
