import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { useState, useEffect } from "react";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const calculateStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 25, label: "Weak", color: "#ef4444" };
    if (score <= 4) return { score: 50, label: "Medium", color: "#f59e0b" };
    if (score <= 5) return { score: 75, label: "Strong", color: "#10b981" };
    return { score: 100, label: "Very Strong", color: "#059669" };
  };

  const { score, label, color } = calculateStrength(password);

  if (!password) return null;

  return (
    <Box mt={1}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">Password strength</Typography>
        <Typography variant="caption" sx={{ color, fontWeight: 600 }}>{label}</Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={score}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: "rgba(0,0,0,0.1)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 3,
            backgroundColor: color,
            transition: "all 0.3s ease",
          },
        }}
      />
    </Box>
  );
}
