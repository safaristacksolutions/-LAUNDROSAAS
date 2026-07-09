import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

interface IconProps {
  sx?: SxProps<Theme>;
  fontSize?: "small" | "medium" | "large" | number;
}

export function LocalLaundryServiceIcon({ sx, fontSize = "medium" }: IconProps) {
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
      <circle cx={9} cy={9} r={1} fill="currentColor" />
      <path d="M8 15c0 2 3 3 4 3s4-1 4-3" />
      <circle cx={15} cy={9} r={1} fill="currentColor" />
    </Box>
  );
}
