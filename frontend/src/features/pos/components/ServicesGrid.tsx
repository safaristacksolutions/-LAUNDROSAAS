import { useQuery } from "@tanstack/react-query";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { posApi } from "../api/posApi";
import { useTransactionEngine } from "../store/transactionStore";
import type { Service } from "../../../types";

export function ServicesGrid() {
  const addItem = useTransactionEngine((s) => s.addItem);

  const { data, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => posApi.getServices().then((r) => r.data),
  });

  if (isLoading) {
    return (
      <Grid container spacing={1}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid key={i} size={6}>
            <Skeleton variant="rounded" height={80} />
          </Grid>
        ))}
      </Grid>
    );
  }

  const services: Service[] = data?.results ?? data ?? [];

  return (
    <Grid container spacing={1}>
      {services.map((service) => (
        <Grid key={service.id} size={6}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardActionArea onClick={() => addItem(service)} sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="h5" sx={{ fontSize: 28 }}>
                  {service.icon}
                </Typography>
                <Typography variant="body2" fontWeight={600} mt={0.5}>
                  {service.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  KES {Number(service.price_kes).toLocaleString()}/{service.unit === "kg" ? "kg" : "item"}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
