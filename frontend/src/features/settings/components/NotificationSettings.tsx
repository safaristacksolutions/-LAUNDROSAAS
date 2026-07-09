import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

export function NotificationSettings() {
  return (
    <Box sx={{ maxWidth: 560 }}>
      <Typography variant="subtitle1" fontWeight={700} mb={2}>Order Notifications</Typography>
      <Stack spacing={1} mb={3}>
        <FormControlLabel control={<Switch defaultChecked />} label="New order received" />
        <FormControlLabel control={<Switch defaultChecked />} label="Order ready for pickup" />
        <FormControlLabel control={<Switch defaultChecked />} label="Order status changed" />
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" fontWeight={700} mb={2}>Payment Notifications</Typography>
      <Stack spacing={1} mb={3}>
        <FormControlLabel control={<Switch defaultChecked />} label="Payment received" />
        <FormControlLabel control={<Switch />} label="Payment failed" />
        <FormControlLabel control={<Switch defaultChecked />} label="M-Pesa STK push status" />
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" fontWeight={700} mb={2}>System Alerts</Typography>
      <Stack spacing={1} mb={3}>
        <FormControlLabel control={<Switch defaultChecked />} label="Low inventory alerts" />
        <FormControlLabel control={<Switch />} label="Daily summary report" />
        <FormControlLabel control={<Switch />} label="Weekly performance digest" />
      </Stack>
      <Button variant="contained" sx={{ borderRadius: 2, px: 4 }}>Save Preferences</Button>
    </Box>
  );
}
