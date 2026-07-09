import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

export function PaymentSettings() {
  return (
    <Box sx={{ maxWidth: 560 }}>
      <Typography variant="subtitle1" fontWeight={700} mb={2}>M-Pesa Integration</Typography>
      <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2 }}>
        Configure your Safaricom M-Pesa Daraja API credentials for STK push payments.
      </Alert>
      <Stack spacing={2.5} mb={3}>
        <TextField fullWidth label="Consumer Key" type="password" />
        <TextField fullWidth label="Consumer Secret" type="password" />
        <TextField fullWidth label="Passkey" type="password" />
        <TextField fullWidth label="Shortcode" placeholder="174379" />
      </Stack>
      <Typography variant="subtitle1" fontWeight={700} mb={2}>Tax Settings</Typography>
      <Stack spacing={2.5} mb={3}>
        <TextField fullWidth label="Tax Rate (%)" defaultValue="16" type="number" />
        <TextField fullWidth label="Currency" defaultValue="KES" />
      </Stack>
      <Button variant="contained" sx={{ borderRadius: 2, px: 4 }}>Save Payment Settings</Button>
    </Box>
  );
}
