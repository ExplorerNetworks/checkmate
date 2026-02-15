"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import InboxIcon from "@mui/icons-material/Inbox";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import CreateTaskForm from "@/components/CreateTaskForm";
import TaskItem from "@/components/TaskItem";
import { useThemeMode } from "@/components/ThemeContext";
import ThemePicker from "@/components/ThemePicker";
import AnimatedEmoji from "@/components/AnimatedEmoji";
import { matchEmoji } from "@/lib/emoji";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskListData {
  id: string;
  name: string;
  tasks: Task[];
}

export default function TaskListPage() {
  const params = useParams();
  const listId = params.listId as string;
  const { mode, toggleMode } = useThemeMode();

  const [list, setList] = useState<TaskListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const fetchList = useCallback(async () => {
    try {
      const res = await fetch(`/api/lists/${listId}`);
      if (res.ok) {
        const data = await res.json();
        setList(data);
      }
    } finally {
      setLoading(false);
    }
  }, [listId]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  async function handleSaveName() {
    const trimmed = nameInput.trim();
    if (!trimmed || trimmed === list?.name) {
      setEditingName(false);
      return;
    }

    await fetch(`/api/lists/${listId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });
    setEditingName(false);
    fetchList();
  }

  async function handleClearCompleted() {
    if (!list) return;
    const completed = list.tasks.filter((t) => t.completed);
    if (completed.length === 0) return;
    if (!confirm(`Delete ${completed.length} completed task(s)?`)) return;

    await Promise.all(
      completed.map((t) =>
        fetch(`/api/lists/${listId}/tasks/${t.id}`, { method: "DELETE" })
      )
    );
    fetchList();
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!list) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
          bgcolor: "background.default",
        }}
      >
        <Typography color="text.secondary">List not found</Typography>
        <Button component={Link} href="/dashboard" startIcon={<ArrowBackIcon />}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  const completedCount = list.tasks.filter((t) => t.completed).length;
  const listEmoji = matchEmoji(list.name, "list");

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={1} sx={{ bgcolor: "background.paper" }}>
        <Toolbar>
          <IconButton component={Link} href="/dashboard" sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
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
          <IconButton onClick={toggleMode}>
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 4 }}>
        {/* List name header */}
        <Box sx={{ mb: 3 }}>
          {editingName ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                  if (e.key === "Escape") setEditingName(false);
                }}
                size="small"
                fullWidth
                autoFocus
              />
              <IconButton onClick={handleSaveName} color="primary" size="small">
                <CheckIcon />
              </IconButton>
              <IconButton onClick={() => setEditingName(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AnimatedEmoji emoji={listEmoji.emoji} animation={listEmoji.animation} size={28} />
              <Typography variant="h5" fontWeight={700} sx={{ flex: 1 }}>
                {list.name}
              </Typography>
              <IconButton
                size="small"
                onClick={() => {
                  setEditingName(true);
                  setNameInput(list.name);
                }}
                sx={{ color: "text.secondary" }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          {list.tasks.length > 0 && (
            <Chip
              label={`${completedCount} of ${list.tasks.length} completed`}
              size="small"
              color={completedCount === list.tasks.length ? "success" : "default"}
              variant="outlined"
              sx={{ mt: 1 }}
            />
          )}
        </Box>

        {/* Add task form */}
        <Box sx={{ mb: 3 }}>
          <CreateTaskForm listId={listId} onCreated={fetchList} />
        </Box>

        {/* Task list */}
        <Card elevation={1}>
          <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
            {list.tasks.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <InboxIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  No tasks yet. Add one above!
                </Typography>
              </Box>
            ) : (
              list.tasks.map((task, i) => (
                <Box key={task.id}>
                  <TaskItem
                    task={task}
                    listId={listId}
                    onUpdated={fetchList}
                  />
                  {i < list.tasks.length - 1 && <Divider />}
                </Box>
              ))
            )}
          </CardContent>
        </Card>

        {/* Clear completed */}
        {completedCount > 0 && (
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Button
              onClick={handleClearCompleted}
              startIcon={<DeleteSweepIcon />}
              color="error"
              size="small"
            >
              Clear completed ({completedCount})
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}
