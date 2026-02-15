"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  useTheme,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const error = theme.palette.error.main;
  const isDark = theme.palette.mode === "dark";

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: isDark
              ? "rgba(0,0,0,0.7)"
              : "rgba(15,23,42,0.45)",
            backdropFilter: "blur(6px)",
          },
        },
      }}
      PaperProps={{
        sx: {
          position: "relative",
          overflow: "visible",
          background: isDark
            ? "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)"
            : "linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)",
          border: "1px solid",
          borderColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.06)",
          borderRadius: "16px",
          boxShadow: `
            0 0 20px ${isDark ? `${primary}30` : `${primary}18`},
            0 0 60px ${isDark ? `${primary}15` : `${primary}08`},
            0 25px 50px rgba(0,0,0,${isDark ? 0.5 : 0.15})
          `,
          animation: "confirmSlideIn 0.25s cubic-bezier(0.16,1,0.3,1)",
          "@keyframes confirmSlideIn": {
            from: { opacity: 0, transform: "scale(0.92) translateY(12px)" },
            to: { opacity: 1, transform: "scale(1) translateY(0)" },
          },
          // Animated glow border
          "&::before": {
            content: '""',
            position: "absolute",
            inset: -1,
            borderRadius: "17px",
            padding: "1.5px",
            background: `conic-gradient(from var(--glow-angle, 0deg), ${primary}, ${error}, ${primary})`,
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            opacity: isDark ? 0.7 : 0.5,
            animation: "glowSpin 3s linear infinite",
          },
          "@keyframes glowSpin": {
            to: { "--glow-angle": "360deg" },
          },
          "@property --glow-angle": {
            syntax: '"<angle>"',
            initialValue: "0deg",
            inherits: "false",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 3,
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isDark
              ? `linear-gradient(135deg, ${error}25, ${error}10)`
              : `linear-gradient(135deg, ${error}18, ${error}08)`,
            border: "1px solid",
            borderColor: `${error}30`,
            mb: 1,
            animation: "iconPulse 2s ease-in-out infinite",
            "@keyframes iconPulse": {
              "0%, 100%": {
                boxShadow: `0 0 0 0 ${error}20`,
              },
              "50%": {
                boxShadow: `0 0 0 8px ${error}00`,
              },
            },
          }}
        >
          <WarningAmberRoundedIcon sx={{ color: error, fontSize: 28 }} />
        </Box>
      </Box>

      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: "1.15rem",
          pb: 0.5,
          pt: 1,
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", pb: 1 }}>
        <DialogContentText
          sx={{
            color: "text.secondary",
            fontSize: "0.9rem",
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 1,
          px: 3,
          pb: 3,
          pt: 1,
        }}
      >
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            flex: 1,
            borderRadius: "10px",
            borderColor: isDark
              ? "rgba(255,255,255,0.12)"
              : "rgba(0,0,0,0.12)",
            color: "text.primary",
            fontWeight: 600,
            "&:hover": {
              borderColor: isDark
                ? "rgba(255,255,255,0.25)"
                : "rgba(0,0,0,0.25)",
              bgcolor: isDark
                ? "rgba(255,255,255,0.04)"
                : "rgba(0,0,0,0.04)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            flex: 1,
            borderRadius: "10px",
            fontWeight: 600,
            bgcolor: error,
            boxShadow: `0 4px 14px ${error}40`,
            "&:hover": {
              bgcolor: error,
              filter: "brightness(1.15)",
              boxShadow: `0 6px 20px ${error}50`,
            },
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
