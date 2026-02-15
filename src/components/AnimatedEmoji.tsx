"use client";

import { Box } from "@mui/material";
import { keyframes } from "@mui/system";

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-4px); }
  50% { transform: translateY(0); }
  75% { transform: translateY(-2px); }
`;

const wiggle = keyframes`
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(12deg); }
  40% { transform: rotate(-10deg); }
  60% { transform: rotate(6deg); }
  80% { transform: rotate(-4deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(15deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-15deg); }
  100% { transform: rotate(0deg); }
`;

const wave = keyframes`
  0%, 100% { transform: rotate(0deg) translateY(0); }
  25% { transform: rotate(8deg) translateY(-2px); }
  50% { transform: rotate(0deg) translateY(0); }
  75% { transform: rotate(-8deg) translateY(-2px); }
`;

const animations = { bounce, wiggle, pulse, spin, wave };

export default function AnimatedEmoji({
  emoji,
  animation,
  size = 20,
}: {
  emoji: string;
  animation: "bounce" | "wiggle" | "pulse" | "spin" | "wave" | "none";
  size?: number;
}) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        fontSize: size,
        lineHeight: 1,
        ...(animation !== "none" && {
          animation: `${animations[animation]} 2s ease-in-out infinite`,
        }),
        cursor: "default",
        flexShrink: 0,
      }}
      role="img"
    >
      {emoji}
    </Box>
  );
}
