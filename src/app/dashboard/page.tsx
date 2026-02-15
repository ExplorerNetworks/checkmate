"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  CircularProgress,
  useTheme,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CreateListForm from "@/components/CreateListForm";
import TaskListCard from "@/components/TaskListCard";
import { useThemeMode } from "@/components/ThemeContext";
import ThemePicker from "@/components/ThemePicker";

interface TaskList {
  id: string;
  name: string;
  taskCount: number;
  completedCount: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);

  const primary = theme.palette.primary.main;
  const isDark = mode === "dark";

  const fetchLists = useCallback(async () => {
    try {
      const res = await fetch("/api/lists");
      if (res.ok) {
        const data = await res.json();
        setLists(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  async function handleDelete(id: string) {
    await fetch(`/api/lists/${id}`, { method: "DELETE" });
    fetchLists();
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <Box sx={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Animated gradient background */}
      <Box
        className="animated-bg"
        sx={{
          background: isDark
            ? `radial-gradient(ellipse at 15% 30%, ${primary}12 0%, transparent 50%),
               radial-gradient(ellipse at 85% 70%, rgba(139,92,246,0.06) 0%, transparent 50%),
               #06080f`
            : `radial-gradient(ellipse at 15% 30%, ${primary}15 0%, transparent 50%),
               radial-gradient(ellipse at 85% 70%, rgba(139,92,246,0.08) 0%, transparent 50%),
               #f0f4ff`,
        }}
      />

      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <CheckBoxOutlinedIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography
            variant="h6"
            fontWeight={700}
            color="primary.main"
            sx={{ flexGrow: 1 }}
          >
            Checkmate
          </Typography>
          <ThemePicker />
          <IconButton onClick={toggleMode} sx={{ mr: 1 }}>
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            size="small"
            color="inherit"
            sx={{ color: "text.secondary" }}
          >
            Log out
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4, position: "relative" }}>
        <Box sx={{ mb: 4 }} className="fade-in-up">
          <CreateListForm onCreated={fetchLists} />
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : lists.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }} className="fade-in-up">
            <AssignmentIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography color="text.secondary">
              No task lists yet. Create one above!
            </Typography>
          </Box>
        ) : (
          <Box
            className="stagger-children"
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
              },
              gap: 2.5,
            }}
          >
            {lists.map((list) => (
              <TaskListCard
                key={list.id}
                list={list}
                onDelete={handleDelete}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
