"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  CheckBoxOutlined,
} from "@mui/icons-material";
import { useThemeMode } from "./ThemeContext";
import ThemePicker from "./ThemePicker";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const theme = useTheme();
  const { mode: themeMode, toggleMode } = useThemeMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";
  const primary = theme.palette.primary.main;
  const isDark = themeMode === "dark";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      {/* Animated gradient background */}
      <Box
        className="animated-bg"
        sx={{
          background: isDark
            ? `radial-gradient(ellipse at 20% 50%, ${primary}15 0%, transparent 50%),
               radial-gradient(ellipse at 80% 20%, ${primary}10 0%, transparent 50%),
               radial-gradient(ellipse at 50% 80%, rgba(139,92,246,0.08) 0%, transparent 50%),
               #06080f`
            : `radial-gradient(ellipse at 20% 50%, ${primary}18 0%, transparent 50%),
               radial-gradient(ellipse at 80% 20%, ${primary}12 0%, transparent 50%),
               radial-gradient(ellipse at 50% 80%, rgba(139,92,246,0.1) 0%, transparent 50%),
               #f0f4ff`,
        }}
      />

      {/* Floating orbs */}
      <Box
        sx={{
          position: "fixed",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${primary}20, transparent 70%)`,
          top: "10%",
          left: "10%",
          filter: "blur(60px)",
          animation: "float 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "fixed",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)`,
          bottom: "15%",
          right: "10%",
          filter: "blur(60px)",
          animation: "float 10s ease-in-out infinite reverse",
          pointerEvents: "none",
        }}
      />

      <Box sx={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 0.5, zIndex: 10 }}>
        <ThemePicker />
        <IconButton onClick={toggleMode}>
          {themeMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>

      <Card
        className="fade-in-up"
        sx={{
          width: "100%",
          maxWidth: 420,
          mx: 2,
          position: "relative",
          overflow: "visible",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: -1,
            borderRadius: "15px",
            padding: "1px",
            background: `linear-gradient(135deg, ${primary}50, transparent 50%, ${primary}30)`,
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            pointerEvents: "none",
          },
        }}
        elevation={0}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <CheckBoxOutlined
                sx={{ fontSize: 32, color: "primary.main" }}
              />
              <Typography
                variant="h5"
                fontWeight={700}
                color="primary.main"
              >
                Checkmate
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {isLogin
                ? "Welcome back! Log in to continue."
                : "Create an account to get started."}
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              size="small"
              sx={{ mb: 2 }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              size="small"
              slotProps={{
                htmlInput: { minLength: 6 },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 2 }}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              size="large"
              sx={{ mb: 2, py: 1.2 }}
            >
              {loading
                ? isLogin
                  ? "Logging in..."
                  : "Creating account..."
                : isLogin
                ? "Log In"
                : "Create Account"}
            </Button>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link
              href={isLogin ? "/register" : "/login"}
              style={{ color: primary, fontWeight: 600, textDecoration: "none" }}
            >
              {isLogin ? "Sign up" : "Log in"}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
