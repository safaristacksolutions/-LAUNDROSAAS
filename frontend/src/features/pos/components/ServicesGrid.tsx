import { useQuery } from "@tanstack/react-query";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { posApi } from "../api/posApi";
import { useTransactionEngine } from "../store/transactionStore";
import type { Service } from "../../../types";

const serviceImages: Record<string, string> = {
  "Wash & Fold": "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=100&q=60",
  "Wash & Iron": "https://images.unsplash.com/photo-1489659639090-5e3a5f1c0e6c?w=100&q=60",
  "Dry Clean": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100&q=60",
  "Iron Only": "https://images.unsplash.com/photo-1551959942-c2c2b0f3d2e2?w=100&q=60",
  "Comforter": "https://images.unsplash.com/photo-1616627542893-c2412a7c2e3d?w=100&q=60",
  "Curtains": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&q=60",
};

export function ServicesGrid() {
  const addItem = useTransactionEngine((s) => s.addItem);

  const { data, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => posApi.getServices().then((r) => r.data),
  });

  if (isLoading) {
    return (
      <Grid container spacing={1.5}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid key={i} size={6}>
            <Skeleton variant="rounded" height={100} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  const services: Service[] = data?.results ?? data ?? [];

  return (
    <Grid container spacing={1.5}>
      {services.map((service) => {
        const imgUrl = serviceImages[service.name] ||
          `https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=100&q=60`;

        return (
          <Grid key={service.id} size={6}>
            <Card
              variant="outlined"
              sx={{
                height: "100%", overflow: "hidden",
                "&:hover .service-img": { transform: "scale(1.1)" },
              }}
            >
              <CardActionArea onClick={() => addItem(service)} sx={{ height: "100%" }}>
                <Box
                  className="service-img"
                  sx={{
                    height: 56, backgroundImage: `url(${imgUrl})`,
                    backgroundSize: "cover", backgroundPosition: "center",
                    transition: "transform 0.3s ease",
                  }}
                />
                <CardContent sx={{ textAlign: "center", py: 1.5, px: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {service.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    KES {Number(service.price_kes).toLocaleString()}/{service.unit === "kg" ? "kg" : "item"}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
