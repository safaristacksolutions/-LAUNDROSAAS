import { useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { CustomerSearch } from "../components/CustomerSearch";
import { ServicesGrid } from "../components/ServicesGrid";
import { CartPane } from "../components/CartPane";
import { useTransactionEngine } from "../store/transactionStore";
import { useAuthStore } from "../../../store/authStore";
import { useTenantStore } from "../../../store/tenantStore";

export default function POSScreen() {
  const user = useAuthStore((s) => s.user);
  const tenant = useTenantStore((s) => s.config);
  const setTaxRate = useTransactionEngine((s) => s.setTaxRate);

  useEffect(() => {
    if (tenant) setTaxRate(tenant.tax_rate);
  }, [tenant, setTaxRate]);

  return (
    <Box sx={{ height: "calc(100vh - 64px)", display: "flex", flexDirection: "column" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          {tenant?.name ?? "LaundryOS"} POS
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.first_name || user?.username}
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2, height: "100%", overflow: "auto" }}>
            <Typography variant="subtitle2" color="text.secondary" mb={1.5}>Customer</Typography>
            <CustomerSearch />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4.5 }}>
          <Paper variant="outlined" sx={{ p: 2, height: "100%", overflow: "auto" }}>
            <Typography variant="subtitle2" color="text.secondary" mb={1.5}>Services</Typography>
            <ServicesGrid />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4.5 }}>
          <Paper variant="outlined" sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
            <CartPane />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
