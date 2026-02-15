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
  useTheme,
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
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const isDark = theme.palette.mode === "dark";
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
      elevation={0}
      sx={{
        position: "relative",
        overflow: "visible",
        transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 12px 40px ${isDark ? `${primary}18` : `${primary}15`}, 0 4px 12px rgba(0,0,0,${isDark ? 0.3 : 0.08})`,
        },
        "&::before": {
          content: '""',
          position: "absolute",
          inset: -1,
          borderRadius: "15px",
          padding: "1px",
          background: `linear-gradient(135deg, ${primary}40, transparent 60%)`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          opacity: 0,
          transition: "opacity 0.25s ease",
          pointerEvents: "none",
        },
        "&:hover::before": {
          opacity: 1,
        },
      }}
    >
      <CardActionArea component={Link} href={`/dashboard/${list.id}`} sx={{ borderRadius: "inherit" }}>
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
              sx={{
                ml: 1,
                mt: -0.5,
                color: "text.disabled",
                "&:hover": { color: "error.main" },
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
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
