import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

export function BrandingSettings() {
  return (
    <Box sx={{ maxWidth: 560 }}>
      <Typography variant="subtitle1" fontWeight={700} mb={2}>Brand Colors</Typography>
      <Stack spacing={2.5} mb={3}>
        <TextField fullWidth label="Primary Color" defaultValue="#4F46E5" />
        <TextField fullWidth label="Secondary Color" defaultValue="#0EA5E9" />
      </Stack>
      <Typography variant="subtitle1" fontWeight={700} mb={2}>Logo</Typography>
      <Paper
        variant="outlined"
        sx={{
          p: 4,
          borderRadius: 2,
          textAlign: "center",
          borderStyle: "dashed",
          mb: 3,
          bgcolor: "action.hover",
        }}
      >
        <Typography variant="body2" color="text.secondary" mb={1}>Upload your logo</Typography>
        <Button variant="outlined" size="small">Choose File</Button>
      </Paper>
      <Button variant="contained" sx={{ borderRadius: 2, px: 4 }}>Save Branding</Button>
    </Box>
  );
}
