import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { laundryApi } from "../api/laundryApi";
import { PageHeader } from "../../../components/cards/PageHeader";
import { WorkflowTimeline } from "../components/WorkflowTimeline";
import { StatusBadge } from "../../../components/data-display/StatusBadge";
import type { Order } from "../../../types";

export default function LaundryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["laundry"],
    queryFn: () => laundryApi.list().then((r) => r.data),
    refetchInterval: 30_000,
  });

  const orders: Order[] = data?.results ?? data ?? [];

  return (
    <>
      <PageHeader title="Laundry Workflow" subtitle="Active orders in process" />
      {isLoading ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="rounded" height={120} />)}
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {orders.map((order) => (
            <Card key={order.id} variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="subtitle2" fontWeight={600}>{order.order_number}</Typography>
                  <StatusBadge status={order.status} />
                </Box>
                <WorkflowTimeline orderId={order.id} currentStatus={order.status} />
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </>
  );
}
