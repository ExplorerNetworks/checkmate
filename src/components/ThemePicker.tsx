"use client";

import { useState } from "react";
import {
  IconButton,
  Popover,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import CheckIcon from "@mui/icons-material/Check";
import { useThemeMode, COLOR_THEMES, type ColorTheme } from "./ThemeContext";

export default function ThemePicker() {
  const { mode, colorTheme, setColorTheme } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  return (
    <>
      <Tooltip title="Change theme color">
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <PaletteIcon />
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        slotProps={{
          paper: { sx: { p: 2, minWidth: 200 } },
        }}
      >
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
          Theme Color
        </Typography>

        <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
          {COLOR_THEMES.map((t) => {
            const color = mode === "light" ? t.light : t.dark;
            const selected = colorTheme === t.id;

            return (
              <Tooltip key={t.id} title={t.label}>
                <Box
                  onClick={() => {
                    setColorTheme(t.id as ColorTheme);
                    setAnchorEl(null);
                  }}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    bgcolor: color,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: selected ? "2px solid" : "2px solid transparent",
                    borderColor: selected ? "text.primary" : "transparent",
                    transition: "transform 0.15s, border-color 0.15s",
                    "&:hover": {
                      transform: "scale(1.15)",
                    },
                  }}
                >
                  {selected && (
                    <CheckIcon sx={{ fontSize: 18, color: "#fff" }} />
                  )}
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Popover>
    </>
  );
}
