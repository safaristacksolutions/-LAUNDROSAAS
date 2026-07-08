import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Box textAlign="center" py={8}>
      {icon && <Box mb={2}>{icon}</Box>}
      <Typography variant="h6" color="text.secondary" gutterBottom>{title}</Typography>
      {description && <Typography variant="body2" color="text.disabled" mb={2}>{description}</Typography>}
      {action}
    </Box>
  );
}
