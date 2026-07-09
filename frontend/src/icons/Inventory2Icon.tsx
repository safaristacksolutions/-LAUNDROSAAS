import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

interface IconProps {
  sx?: SxProps<Theme>;
  fontSize?: "small" | "medium" | "large" | number;
}

export function Inventory2Icon({ sx, fontSize = "medium" }: IconProps) {
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
      <rect x={3} y={3} width={18} height={18} rx={2} />
      <rect x={3} y={9} width={18} height={4} />
      <line x1={9} y1={3} x2={9} y2={9} />
      <line x1={15} y1={3} x2={15} y2={9} />
    </Box>
  );
}
