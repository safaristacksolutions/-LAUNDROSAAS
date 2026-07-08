import { useQuery } from "@tanstack/react-query";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { dashboardApi } from "../api/dashboardApi";
import { PageHeader } from "../../../components/cards/PageHeader";
import { formatKES } from "../../../utilities/formatters";

function StatCard({ title, value, loading }: { title: string; value?: string; loading?: boolean }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        {loading ? <Skeleton width={100} /> : <Typography variant="h5" fontWeight={700}>{value}</Typography>}
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
    <>
      <PageHeader title="Dashboard" subtitle="Today's overview" />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Orders Today" value={data?.orders_today?.toString()} loading={isLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Revenue" value={data?.total_revenue ? formatKES(data.total_revenue) : undefined} loading={isLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Cash" value={data?.cash ? formatKES(data.cash) : undefined} loading={isLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="M-Pesa" value={data?.mpesa ? formatKES(data.mpesa) : undefined} loading={isLoading} />
        </Grid>
      </Grid>
    </>
  );
}
