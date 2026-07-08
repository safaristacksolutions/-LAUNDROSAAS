import Chip from "@mui/material/Chip";
import { STATUS_LABELS, STATUS_COLORS } from "../../utilities/constants";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = STATUS_COLORS[status] ?? "#6B7280";
  return (
    <Chip
      label={STATUS_LABELS[status] ?? status}
      size="small"
      sx={{ bgcolor: `${color}20`, color, fontWeight: 600, fontSize: "0.75rem" }}
    />
  );
}
