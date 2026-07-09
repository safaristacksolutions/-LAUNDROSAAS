import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

interface IconProps {
  sx?: SxProps<Theme>;
  fontSize?: "small" | "medium" | "large" | number;
}

export function AccountCircleIcon({ sx, fontSize = "medium" }: IconProps) {
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
      <circle cx={12} cy={12} r={10} />
      <circle cx={12} cy={10} r={4} />
      <path d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6" />
    </Box>
  );
}
