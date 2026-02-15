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
  const { mode, toggleMode } = useThemeMode();
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);

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
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={1} sx={{ bgcolor: "background.paper" }}>
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

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <CreateListForm onCreated={fetchLists} />
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : lists.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <AssignmentIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography color="text.secondary">
              No task lists yet. Create one above!
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
              },
              gap: 2,
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
