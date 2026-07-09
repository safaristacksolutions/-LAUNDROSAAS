import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { laundryApi } from "../api/laundryApi";
import { PageHeader } from "../../../components/cards/PageHeader";
import { StatusBadge } from "../../../components/data-display/StatusBadge";
import { formatKES, formatDate } from "../../../utilities/formatters";
import { ORDER_STATUS_FLOW, STATUS_LABELS, STATUS_COLORS } from "../../../utilities/constants";
import type { Order } from "../../../types";

export default function LaundryPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["laundry"],
    queryFn: () => laundryApi.list().then((r) => r.data),
    refetchInterval: 30_000,
  });

  const orders: Order[] = data?.results ?? data ?? [];

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      laundryApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["laundry"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  // Count orders per status
  const countByStatus = ORDER_STATUS_FLOW.reduce<Record<string, number>>((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <Box>
      <PageHeader
        title="Laundry Workflow"
        subtitle="Track orders through the laundry pipeline"
      />

      {/* Pipeline summary cards */}
      <Grid container spacing={2} mb={3}>
        {ORDER_STATUS_FLOW.filter((s) => s !== "delivered").map((s) => {
          const color = STATUS_COLORS[s] ?? "#64748B";
          return (
            <Grid key={s} size={{ xs: 6, sm: 4, md: 2 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
                  border: `1px solid ${color}25`,
                  textAlign: "center",
                  "&:hover": { transform: "translateY(-3px)", boxShadow: `0 8px 24px ${color}30` },
                  transition: "all 0.2s ease",
                }}
                className="fade-in-up"
              >
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h4" fontWeight={800} sx={{ color }}>
                    {isLoading ? <Skeleton width={32} sx={{ mx: "auto" }} /> : countByStatus[s]}
                  </Typography>
                  <Typography variant="caption" sx={{ color: `${color}BB`, fontWeight: 600 }}>
                    {STATUS_LABELS[s]}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Active orders list */}
      <Typography variant="subtitle1" fontWeight={700} mb={2}>
        Active Orders
      </Typography>

      {isLoading ? (
        <Stack spacing={2}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={120} sx={{ borderRadius: 3 }} />
          ))}
        </Stack>
      ) : orders.length === 0 ? (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <LocalLaundryServiceIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography color="text.secondary">No active orders in the pipeline</Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {orders
            .filter((o) => o.status !== "delivered")
            .map((order) => {
              const currentIdx = ORDER_STATUS_FLOW.indexOf(order.status as typeof ORDER_STATUS_FLOW[number]);
              const nextStatus = ORDER_STATUS_FLOW[currentIdx + 1];

              return (
                <Card
                  key={order.id}
                  variant="outlined"
                  sx={{ borderRadius: 3, "&:hover": { borderColor: "primary.main" }, transition: "border-color 0.2s" }}
                  className="fade-in-up"
                >
                  <CardContent>
                    <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} justifyContent="space-between" gap={2}>
                      <Stack direction="row" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            bgcolor: `${STATUS_COLORS[order.status] ?? "#64748B"}20`,
                            color: STATUS_COLORS[order.status] ?? "#64748B",
                            borderRadius: 2,
                          }}
                        >
                          <LocalLaundryServiceIcon />
                        </Avatar>
                        <Box>
                          <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
                            <Typography variant="subtitle2" fontWeight={700}>
                              {order.order_number}
                            </Typography>
                            <StatusBadge status={order.status} />
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            {order.customer_name ?? `Customer #${order.customer}`}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            {formatDate(order.created_at)} · {formatKES(order.total)}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Pipeline chips */}
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {ORDER_STATUS_FLOW.slice(0, 6).map((s, idx) => (
                          <Chip
                            key={s}
                            label={STATUS_LABELS[s]}
                            size="small"
                            sx={{
                              fontSize: "0.68rem",
                              height: 22,
                              fontWeight: 600,
                              bgcolor:
                                idx < currentIdx
                                  ? `${STATUS_COLORS[s]}30`
                                  : idx === currentIdx
                                    ? STATUS_COLORS[s]
                                    : "grey.100",
                              color:
                                idx < currentIdx
                                  ? STATUS_COLORS[s]
                                  : idx === currentIdx
                                    ? "white"
                                    : "text.disabled",
                            }}
                          />
                        ))}
                      </Stack>

                      {nextStatus && (
                        <Button
                          variant="contained"
                          size="small"
                          endIcon={<ArrowForwardIcon />}
                          disabled={mutation.isPending}
                          onClick={() => mutation.mutate({ id: order.id, status: nextStatus })}
                          sx={{ borderRadius: 28, whiteSpace: "nowrap", flexShrink: 0 }}
                        >
                          Mark {STATUS_LABELS[nextStatus]}
                        </Button>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
        </Stack>
      )}
    </Box>
  );
}
