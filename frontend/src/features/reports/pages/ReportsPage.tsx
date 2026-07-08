import { useQuery } from "@tanstack/react-query";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { reportsApi } from "../api/reportsApi";
import { PageHeader } from "../../../components/cards/PageHeader";
import { formatKES } from "../../../utilities/formatters";

export default function ReportsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["reports-sales"],
    queryFn: () => reportsApi.sales().then((r) => r.data),
  });

  return (
    <>
      <PageHeader title="Reports" subtitle="Sales and performance data" />
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>Sales Summary</Typography>
          {isLoading ? (
            <Skeleton variant="rounded" height={200} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {data ? `Total revenue: ${formatKES(data.total_revenue ?? 0)}` : "No data available"}
            </Typography>
          )}
        </CardContent>
      </Card>
    </>
  );
}
