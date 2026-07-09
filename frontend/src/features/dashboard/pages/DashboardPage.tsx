import { useQuery } from "@tanstack/react-query";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { dashboardApi } from "../api/dashboardApi";
import { PageHeader } from "../../../components/cards/PageHeader";
import { formatKES } from "../../../utilities/formatters";
import type { DashboardData } from "../../../types";
import { StatusBadge } from "../../../components/data-display/StatusBadge";

// ─── KPI stat card ────────────────────────────────────────────────────────────
interface KPICardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  loading?: boolean;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  trend?: string;
}

function KPICard({ title, value, subtitle, loading, color, bgColor, icon, trend }: KPICardProps) {
  return (
    <Card
      className="fade-in-up"
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: "none",
        background: bgColor,
        position: "relative",
        "&:hover": { transform: "translateY(-4px)", boxShadow: `0 16px 40px ${color}28` },
        transition: "all 0.3s ease",
      }}
    >
      {/* Decorative circle */}
      <Box
        sx={{
          position: "absolute",
          right: -20,
          top: -20,
          width: 110,
          height: 110,
          borderRadius: "50%",
          bgcolor: `${color}15`,
        }}
      />
      <CardContent sx={{ position: "relative", zIndex: 1, py: 2.5, px: 3 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ color: `${color}CC`, mb: 0.5 }}>
              {title}
            </Typography>
            {loading ? (
              <Skeleton width={110} height={38} sx={{ bgcolor: `${color}20` }} />
            ) : (
              <Typography variant="h4" fontWeight={800} sx={{ color, lineHeight: 1.2 }}>
                {value ?? "—"}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" sx={{ color: `${color}99`, mt: 0.5, display: "block" }}>
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Chip
                label={trend}
                size="small"
                sx={{
                  mt: 1,
                  height: 22,
                  bgcolor: `${color}20`,
                  color: `${color}FF`,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              />
            )}
          </Box>
          <Avatar
            sx={{
              width: 52,
              height: 52,
              bgcolor: `${color}22`,
              color,
              borderRadius: 2.5,
            }}
          >
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ─── Placeholder chart area ────────────────────────────────────────────────────
function ChartPlaceholder({ title, height = 220 }: { title: string; height?: number }) {
  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: 3, height: "100%" }}
      className="fade-in-up"
    >
       <CardContent>
         <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
           <Typography variant="subtitle1" fontWeight={700}>
             {title}
           </Typography>
           <Box component="span" sx={{ color: "text.disabled", fontSize: 20 }}>📊</Box>
         </Stack>
        <Box
          sx={{
            height,
            borderRadius: 2,
            background: "linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Box component="span" sx={{ fontSize: 40, color: "text.disabled" }}>📈</Box>
          <Typography variant="body2" color="text.disabled">
            Chart coming soon
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

// ─── Mock recent orders row ────────────────────────────────────────────────────
const MOCK_ORDERS = [
  { id: 1001, order_number: "ORD-2401", customer_name: "Jane Wanjiku", status: "ready", total: 450, created_at: new Date().toISOString() },
  { id: 1002, order_number: "ORD-2400", customer_name: "Peter Kamau", status: "washing", total: 280, created_at: new Date().toISOString() },
  { id: 1003, order_number: "ORD-2399", customer_name: "Mary Akinyi", status: "ironing", total: 620, created_at: new Date().toISOString() },
  { id: 1004, order_number: "ORD-2398", customer_name: "David Otieno", status: "delivered", total: 350, created_at: new Date().toISOString() },
  { id: 1005, order_number: "ORD-2397", customer_name: "Grace Njeri", status: "received", total: 180, created_at: new Date().toISOString() },
];

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: () => dashboardApi.getStats().then((r) => r.data),
  });

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <Box>
      <PageHeader
        title={`${greeting} 👋`}
        subtitle="Here's what's happening with your laundry today."
      />

      {isError && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          Dashboard data unavailable — showing cached view.
        </Alert>
      )}

      {/* KPI cards */}
      <Grid container spacing={2.5} mb={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KPICard
            title="Orders Today"
            value={data?.orders_today ?? "—"}
            loading={isLoading}
            color="#4F46E5"
            bgColor="linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)"
            icon={<Box component="span" sx={{ fontSize: 20 }}>🛒</Box>}
            trend="+12% vs yesterday"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KPICard
            title="Total Revenue"
            value={data?.total_revenue !== undefined ? formatKES(data.total_revenue) : undefined}
            loading={isLoading}
            color="#10B981"
            bgColor="linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)"
            icon={<Box component="span" sx={{ fontSize: 20 }}>📊</Box>}
            trend="+8% this week"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KPICard
            title="M-Pesa"
            value={data?.mpesa !== undefined ? formatKES(data.mpesa) : undefined}
            loading={isLoading}
            color="#0EA5E9"
            bgColor="linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)"
            icon={<Box component="span" sx={{ fontSize: 20 }}>📱</Box>}
            subtitle="Mobile payments"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KPICard
            title="Cash"
            value={data?.cash !== undefined ? formatKES(data.cash) : undefined}
            loading={isLoading}
            color="#F59E0B"
            bgColor="linear-gradient(135deg, #FFFBEB 0%, #FEF9C3 100%)"
            icon={<Box component="span" sx={{ fontSize: 20 }}>💰</Box>}
            subtitle="Cash collected"
          />
        </Grid>
      </Grid>

      {/* Overdue alert */}
      {(data?.overdue_pickups ?? 0) > 0 && (
        <Alert
          severity="warning"
          sx={{ mb: 3, borderRadius: 2, fontWeight: 500 }}
        >
          {data!.overdue_pickups} order{data!.overdue_pickups > 1 ? "s are" : " is"} overdue for
          pickup. Notify customers to avoid delays.
        </Alert>
      )}

      {/* Charts row */}
      <Grid container spacing={2.5} mb={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <ChartPlaceholder title="Revenue This Week" height={220} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ChartPlaceholder title="Orders by Status" height={220} />
        </Grid>
      </Grid>

      {/* Recent orders table */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card variant="outlined" sx={{ borderRadius: 3 }} className="fade-in-up">
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle1" fontWeight={700}>
                  Recent Orders
                </Typography>
                <Chip label="Live" size="small" color="success" sx={{ fontSize: "0.7rem", height: 22 }} />
              </Stack>
              <TableContainer component={Box}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem", color: "text.secondary", textTransform: "uppercase" }}>Order #</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem", color: "text.secondary", textTransform: "uppercase" }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.72rem", color: "text.secondary", textTransform: "uppercase" }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.72rem", color: "text.secondary", textTransform: "uppercase" }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(isLoading ? [] : MOCK_ORDERS).map((order) => (
                      <TableRow
                        key={order.id}
                        hover
                        sx={{ "&:last-child td": { border: 0 }, cursor: "pointer" }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={600} color="primary.main">
                            {order.order_number}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{order.customer_name}</Typography>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={order.status} />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={700}>
                            {formatKES(order.total)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    {isLoading &&
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          {[1, 2, 3, 4].map((j) => (
                            <TableCell key={j}>
                              <Skeleton height={22} />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick stats panel */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }} className="fade-in-up">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} mb={2}>
                Workflow Summary
              </Typography>
              {[
                { label: "Received", status: "received", count: 4 },
                { label: "Washing", status: "washing", count: 7 },
                { label: "Drying", status: "drying", count: 3 },
                { label: "Ironing", status: "ironing", count: 5 },
                { label: "Ready for Pickup", status: "ready", count: 9 },
                { label: "Delivered Today", status: "delivered", count: 12 },
              ].map(({ label, status, count }) => (
                <Stack
                  key={status}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  py={1}
                  sx={{ borderBottom: "1px solid", borderColor: "divider", "&:last-child": { borderBottom: "none" } }}
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                      <Box component="span" sx={{ fontSize: 16, color: "text.disabled" }}>🧺</Box>
                    <Typography variant="body2">{label}</Typography>
                  </Stack>
                  <StatusBadge status={status} />
                </Stack>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
