import { useQuery } from "@tanstack/react-query";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { dashboardApi } from "../api/dashboardApi";
import { PageHeader } from "../../../components/cards/PageHeader";
import { formatKES } from "../../../utilities/formatters";

function StatCard({ title, value, subtitle, loading, color }: {
  title: string; value?: string; subtitle?: string; loading?: boolean; color?: string;
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderTop: `4px solid ${color || "#1976D2"}`,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 40px rgba(0,0,0,0.12)" },
      }}
      className="fade-in-up"
    >
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
          {title}
        </Typography>
        {loading
          ? <Skeleton width={120} height={32} />
          : <Typography variant="h4" fontWeight={700} sx={{ color: color || "inherit" }}>
              {value}
            </Typography>
        }
        {subtitle && (
          <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardApi.getStats().then((r) => r.data),
  });

  return (
    <Box>
      <PageHeader title="Dashboard" subtitle="Today's performance at a glance" />
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Orders Today" value={data?.orders_today?.toString()} loading={isLoading} color="#1976D2" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Revenue" value={data?.total_revenue ? formatKES(data.total_revenue) : undefined} loading={isLoading} color="#2E7D32" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Cash" value={data?.cash ? formatKES(data.cash) : undefined} loading={isLoading} color="#F57C00" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="M-Pesa" value={data?.mpesa ? formatKES(data.mpesa) : undefined} loading={isLoading} color="#1565C0" />
        </Grid>
      </Grid>
    </Box>
  );
}
