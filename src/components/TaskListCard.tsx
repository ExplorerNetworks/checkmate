"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  IconButton,
  Box,
  LinearProgress,
  Chip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { matchEmoji } from "@/lib/emoji";
import AnimatedEmoji from "./AnimatedEmoji";
import ConfirmDialog from "./ConfirmDialog";

interface TaskListCardProps {
  list: {
    id: string;
    name: string;
    taskCount: number;
    completedCount: number;
  };
  onDelete: (id: string) => void;
}

export default function TaskListCard({ list, onDelete }: TaskListCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const progress =
    list.taskCount > 0 ? (list.completedCount / list.taskCount) * 100 : 0;
  const emojiMatch = matchEmoji(list.name, "list");

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setConfirmOpen(true);
  }

  return (
    <Card
      elevation={1}
      sx={{
        transition: "box-shadow 0.2s, transform 0.2s",
        "&:hover": { elevation: 4, transform: "translateY(-2px)", boxShadow: 4 },
      }}
    >
      <CardActionArea component={Link} href={`/dashboard/${list.id}`}>
        <CardContent sx={{ pb: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 0 }}>
              <AnimatedEmoji emoji={emojiMatch.emoji} animation={emojiMatch.animation} size={22} />
              <Typography variant="subtitle1" fontWeight={600} noWrap>
                {list.name}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{ ml: 1, mt: -0.5, color: "text.disabled", "&:hover": { color: "error.main" } }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            {list.taskCount === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No tasks yet
              </Typography>
            ) : (
              <>
                <Chip
                  label={`${list.completedCount}/${list.taskCount}`}
                  size="small"
                  color={list.completedCount === list.taskCount ? "success" : "default"}
                  variant="outlined"
                />
                <Box sx={{ flex: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              </>
            )}
          </Box>
        </CardContent>
      </CardActionArea>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete list"
        message={`Delete "${list.name}" and all its tasks?`}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete(list.id);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </Card>
  );
}
