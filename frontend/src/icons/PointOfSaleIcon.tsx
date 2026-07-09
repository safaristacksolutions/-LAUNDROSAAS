import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

interface IconProps {
  sx?: SxProps<Theme>;
  fontSize?: "small" | "medium" | "large" | number;
}

export function PointOfSaleIcon({ sx, fontSize = "medium" }: IconProps) {
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
      <rect x={2} y={3} width={20} height={18} rx={2} />
      <line x1={2} y1={8} x2={22} y2={8} />
      <line x1={10} y1={13} x2={14} y2={13} />
      <line x1={10} y1={17} x2={14} y2={17} />
    </Box>
  );
}
