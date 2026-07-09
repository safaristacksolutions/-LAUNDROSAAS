import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";

export function GeneralSettings() {
  return (
    <Box sx={{ maxWidth: 560 }}>
      <Typography variant="subtitle1" fontWeight={700} mb={2}>Business Information</Typography>
      <Stack spacing={2.5} mb={3}>
        <TextField fullWidth label="Business Name" defaultValue="EasyWash Laundry" />
        <TextField fullWidth label="Phone Number" defaultValue="+254 712 345 678" />
        <TextField fullWidth label="Email Address" defaultValue="hello@easywash.co.ke" />
        <TextField fullWidth label="Address" defaultValue="123 Moi Avenue, Nairobi" multiline rows={2} />
      </Stack>
      <Typography variant="subtitle1" fontWeight={700} mb={2}>Preferences</Typography>
      <Stack spacing={1.5} mb={3}>
        <FormControlLabel control={<Switch defaultChecked />} label="Enable SMS notifications" />
        <FormControlLabel control={<Switch />} label="Enable email receipts" />
        <FormControlLabel control={<Switch defaultChecked />} label="Auto-assign orders to available staff" />
      </Stack>
      <Button variant="contained" sx={{ borderRadius: 2, px: 4 }}>Save Changes</Button>
    </Box>
  );
}
