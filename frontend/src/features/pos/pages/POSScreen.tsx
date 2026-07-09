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


const BG_URL = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80";

export default function POSScreen() {
  const user = useAuthStore((s) => s.user);
  const tenant = useTenantStore((s) => s.config);
  const setTaxRate = useTransactionEngine((s) => s.setTaxRate);

  useEffect(() => {
    if (tenant) setTaxRate(tenant.tax_rate);
  }, [tenant, setTaxRate]);

  return (
    <Box sx={{ height: "calc(100vh - 64px)", display: "flex", flexDirection: "column", background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}>
      <Paper
        sx={{
          p: 3, mb: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between",
          background: `linear-gradient(135deg, ${tenant?.primary_color || '#1976D2'}, ${tenant?.secondary_color || '#9C27B0'})`,
          backdropFilter: "blur(12px)", borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
        className="fade-in-up"
      >
        <Box display="flex" alignItems=" " gap={3}>
          <Box
            sx={{
              width: 56, height: 56, borderRadius: 3,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 28, fontWeight: 800,
              border: "2px solid rgba(255,255,255,0.3)",
            }}
          >
            E
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} color="white">
              {tenant?.name ?? "EasyWash"} POS
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.9)">
              {user?.full_name || user?.username} &middot; {new Date().toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            width: 100, height: 100, borderRadius: 3, overflow: "hidden", opacity: 0.25,
            backgroundImage: `url(${BG_URL})`, backgroundSize: "cover", backgroundPosition: "center",
            border: "2px solid rgba(255,255,255,0.2)",
          }}
        />
      </Paper>

      <Grid container spacing={2.5} sx={{ flex: 1, minHeight: 0, px: 0.5 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              height: "100%", 
              overflow: "auto", 
              borderRadius: 3, 
              background: "white",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              borderColor: "rgba(0,0,0,0.08)"
            }} 
            className="slide-in-right"
          >
            <Typography variant="subtitle1" color="text.primary" fontWeight={700} mb={2}>
                CUSTOMER
              </Typography>
            <CustomerSearch />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4.5 }}>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              height: "100%", 
              overflow: "auto", 
              borderRadius: 3,
              background: "white",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              borderColor: "rgba(0,0,0,0.08)"
            }} 
            className="slide-in-right"
          >
            <Typography variant="subtitle1" color="text.primary" fontWeight={700} mb={2}>
                SERVICES
              </Typography>
            <ServicesGrid />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4.5 }}>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              height: "100%", 
              display: "flex", 
              flexDirection: "column", 
              borderRadius: 3,
              background: "white",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              borderColor: "rgba(0,0,0,0.08)"
            }} 
            className="slide-in-right"
          >
            <Typography variant="subtitle1" color="text.primary" fontWeight={700} mb={2}>
                CART
              </Typography>
            <CartPane />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
