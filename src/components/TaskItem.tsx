"use client";

import { useState } from "react";
import {
  Box,
  Checkbox,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { matchEmoji } from "@/lib/emoji";
import AnimatedEmoji from "./AnimatedEmoji";

interface TaskItemProps {
  task: {
    id: string;
    text: string;
    completed: boolean;
  };
  listId: string;
  onUpdated: () => void;
}

export default function TaskItem({ task, listId, onUpdated }: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const emojiMatch = matchEmoji(task.text);

  async function handleToggle() {
    await fetch(`/api/lists/${listId}/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    onUpdated();
  }

  async function handleSaveEdit() {
    const trimmed = editText.trim();
    if (!trimmed || trimmed === task.text) {
      setEditing(false);
      setEditText(task.text);
      return;
    }

    await fetch(`/api/lists/${listId}/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed }),
    });
    setEditing(false);
    onUpdated();
  }

  async function handleDelete() {
    if (!confirm("Delete this task?")) return;
    await fetch(`/api/lists/${listId}/tasks/${task.id}`, {
      method: "DELETE",
    });
    onUpdated();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSaveEdit();
    else if (e.key === "Escape") {
      setEditing(false);
      setEditText(task.text);
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: 0.75,
        px: 1,
        borderRadius: 1,
        "&:hover": { bgcolor: "action.hover" },
        "&:hover .task-actions": { opacity: 1 },
      }}
    >
      <Checkbox
        checked={task.completed}
        onChange={handleToggle}
        size="small"
        sx={{ p: 0.5 }}
      />

      {!editing && (
        <AnimatedEmoji
          emoji={emojiMatch.emoji}
          animation={task.completed ? "pulse" : emojiMatch.animation}
          size={18}
        />
      )}

      {editing ? (
        <TextField
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={handleKeyDown}
          size="small"
          fullWidth
          autoFocus
          variant="standard"
        />
      ) : (
        <Typography
          variant="body2"
          sx={{
            flex: 1,
            cursor: "pointer",
            textDecoration: task.completed ? "line-through" : "none",
            color: task.completed ? "text.disabled" : "text.primary",
          }}
          onClick={() => {
            setEditing(true);
            setEditText(task.text);
          }}
        >
          {task.text}
        </Typography>
      )}

      <Box
        className="task-actions"
        sx={{ display: "flex", opacity: 0, transition: "opacity 0.15s" }}
      >
        <IconButton
          size="small"
          onClick={() => {
            setEditing(true);
            setEditText(task.text);
          }}
          sx={{ color: "text.secondary" }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleDelete}
          sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
