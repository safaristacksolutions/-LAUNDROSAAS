import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

interface IconProps {
  sx?: SxProps<Theme>;
  fontSize?: "small" | "medium" | "large" | number;
}

export function BadgeIcon({ sx, fontSize = "medium" }: IconProps) {
  const size = typeof fontSize === "number" ? fontSize : fontSize === "small" ? 18 : fontSize === "large" ? 28 : 22;
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      sx={sx}
    >
      <rect x={4} y={4} width={16} height={16} rx={2} />
      <circle cx={12} cy={10} r={3} />
      <line x1={8} y1={18} x2={16} y2={18} />
    </Box>
  );
}
