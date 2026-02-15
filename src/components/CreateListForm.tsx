"use client";

import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function CreateListForm({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (res.ok) {
        setName("");
        onCreated();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 1.5 }}>
      <TextField
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New list name..."
        size="small"
        fullWidth
        slotProps={{ htmlInput: { maxLength: 100 } }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={loading || !name.trim()}
        startIcon={<AddIcon />}
        sx={{ whiteSpace: "nowrap" }}
      >
        Create
      </Button>
    </Box>
  );
}
