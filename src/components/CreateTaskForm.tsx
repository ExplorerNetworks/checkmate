"use client";

import { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function CreateTaskForm({
  listId,
  onCreated,
}: {
  listId: string;
  onCreated: () => void;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/lists/${listId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (res.ok) {
        setText("");
        onCreated();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <TextField
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a task..."
        size="small"
        fullWidth
        variant="outlined"
      />
      <IconButton
        type="submit"
        disabled={loading || !text.trim()}
        color="primary"
        sx={{ p: 1 }}
      >
        <AddCircleIcon fontSize="large" />
      </IconButton>
    </Box>
  );
}
