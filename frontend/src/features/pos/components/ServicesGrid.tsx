import { useQuery } from "@tanstack/react-query";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useTenantStore } from "../../../store/tenantStore";
import { posApi } from "../api/posApi";
import { useTransactionEngine } from "../store/transactionStore";
import type { Service } from "../../../types";
import { LocalLaundryService, DryCleaning, Iron, Checkroom } from "@mui/icons-material";

const serviceImages: Record<string, string> = {
  "Wash & Fold": "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=200&q=80",
  "Wash & Iron": "https://images.unsplash.com/photo-1489659639090-5e3a5f1c0e6c?w=200&q=80",
  "Dry Clean": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&q=80",
  "Iron Only": "https://images.unsplash.com/photo-1551959942-c2c2b0f3d2e2?w=200&q=80",
  "Comforter": "https://images.unsplash.com/photo-1616627542893-c2412a7c2e3d?w=200&q=80",
  "Curtains": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80",
};

const serviceIcons: Record<string, React.ReactNode> = {
  "Wash & Fold": <LocalLaundryService />,
  "Wash & Iron": <Checkroom />,
  "Dry Clean": <DryCleaning />,
  "Iron Only": <Iron />,
  "Comforter": <LocalLaundryService />,
  "Curtains": <Checkroom />,
};

export function ServicesGrid() {
  const addItem = useTransactionEngine((s) => s.addItem);
  const tenant = useTenantStore((s) => s.config);

  const { data, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => posApi.getServices().then((r) => r.data),
  });

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid key={i} size={6}>
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  const services: Service[] = data?.results ?? data ?? [];

  return (
    <Grid container spacing={2}>
      {services.map((service) => {
        const imgUrl = serviceImages[service.name] ||
          `https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=200&q=80`;
        const icon = serviceIcons[service.name] || <LocalLaundryService />;

        return (
          <Grid key={service.id} size={6}>
            <Card
              sx={{
                height: "100%", 
                overflow: "hidden",
                borderRadius: 3,
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                transition: "all 0.3s ease",
                "&:hover": { 
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  borderColor: tenant?.primary_color || "#1976D2",
                },
              }}
            >
              <CardActionArea onClick={() => addItem(service)} sx={{ height: "100%" }}>
                <Box
                  sx={{
                    height: 70, 
                    backgroundImage: `url(${imgUrl})`,
                    backgroundSize: "cover", 
                    backgroundPosition: "center",
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(135deg, ${tenant?.primary_color || '#1976D2'}40 0%, ${tenant?.secondary_color || '#9C27B0'}40 100%)`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: tenant?.primary_color || "#1976D2",
                    }}
                  >
                    {icon}
                  </Box>
                </Box>
                <CardContent sx={{ textAlign: "center", py: 2, px: 1.5 }}>
                  <Typography variant="body2" fontWeight={700} gutterBottom>
                    {service.name}
                  </Typography>
                  <Chip
                    label={`KES ${service.price.toLocaleString()}/${service.unit}`}
                    size="small"
                    sx={{
                      background: `${tenant?.primary_color || '#1976D2'}10`,
                      color: tenant?.primary_color || "#1976D2",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      height: 24,
                    }}
                  />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
