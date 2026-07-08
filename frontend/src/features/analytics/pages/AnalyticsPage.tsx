import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid2";
import { analyticsApi } from "../../../api/analytics.api";
import { PageHeader } from "../../../components/cards/PageHeader";

export default function AnalyticsPage() {
  const { data: forecast, isLoading: forecastLoading } = useQuery({
    queryKey: ["analytics-forecast"],
    queryFn: () => analyticsApi.forecast().then((r) => r.data),
  });

  const { data: rfm, isLoading: rfmLoading } = useQuery({
    queryKey: ["analytics-rfm"],
    queryFn: () => analyticsApi.rfm().then((r) => r.data),
  });

  return (
    <Box>
      <PageHeader title="Analytics" subtitle="ML-powered insights" />
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Revenue Forecast
              </Typography>
              {forecastLoading
                ? <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} />
                : <Typography variant="body2" color="text.secondary">
                    30-day projection loaded
                  </Typography>
              }
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Customer Segments (RFM)
              </Typography>
              {rfmLoading
                ? <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} />
                : <Typography variant="body2" color="text.secondary">
                    RFM segments computed
                  </Typography>
              }
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
