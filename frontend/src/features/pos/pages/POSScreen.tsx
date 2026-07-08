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

const BG_URL = "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=1200&q=80";

export default function POSScreen() {
  const user = useAuthStore((s) => s.user);
  const tenant = useTenantStore((s) => s.config);
  const setTaxRate = useTransactionEngine((s) => s.setTaxRate);

  useEffect(() => {
    if (tenant) setTaxRate(tenant.tax_rate);
  }, [tenant, setTaxRate]);

  return (
    <Box sx={{ height: "calc(100vh - 64px)", display: "flex", flexDirection: "column" }}>
      <Paper
        sx={{
          p: 2.5, mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between",
          background: `linear-gradient(135deg, ${tenant?.primary_color || '#1976D2'}15, ${tenant?.primary_color || '#1976D2'}05)`,
          backdropFilter: "blur(8px)", borderRadius: 3,
        }}
        className="fade-in-up"
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 40, height: 40, borderRadius: 2,
              background: `linear-gradient(135deg, ${tenant?.primary_color || '#1976D2'}, ${tenant?.secondary_color || '#9C27B0'})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 20, fontWeight: 700,
            }}
          >
            E
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {tenant?.name ?? "EasyWash"} POS
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.first_name || user?.username} &middot; {new Date().toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            width: 80, height: 80, borderRadius: 3, overflow: "hidden", opacity: 0.15,
            backgroundImage: `url(${BG_URL})`, backgroundSize: "cover",
          }}
        />
      </Paper>

      <Grid container spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2.5, height: "100%", overflow: "auto", borderRadius: 3 }} className="slide-in-right">
            <Typography variant="subtitle2" color="text.secondary" mb={1.5} fontWeight={600}>
              CUSTOMER
            </Typography>
            <CustomerSearch />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4.5 }}>
          <Paper variant="outlined" sx={{ p: 2.5, height: "100%", overflow: "auto", borderRadius: 3 }} className="slide-in-right">
            <Typography variant="subtitle2" color="text.secondary" mb={1.5} fontWeight={600}>
              SERVICES
            </Typography>
            <ServicesGrid />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4.5 }}>
          <Paper variant="outlined" sx={{ p: 2.5, height: "100%", display: "flex", flexDirection: "column", borderRadius: 3 }} className="slide-in-right">
            <Typography variant="subtitle2" color="text.secondary" mb={1.5} fontWeight={600}>
              CART
            </Typography>
            <CartPane />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
