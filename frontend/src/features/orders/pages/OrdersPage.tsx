import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import TablePagination from "@mui/material/TablePagination";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import { ordersApi } from "../api/ordersApi";
import { PageHeader } from "../../../components/cards/PageHeader";
import { StatusBadge } from "../../../components/data-display/StatusBadge";
import { formatKES, formatDateTime } from "../../../utilities/formatters";
import type { Order, OrderStatus } from "../../../types";
import { ORDER_STATUS_FLOW, STATUS_LABELS } from "../../../utilities/constants";

const ALL_STATUSES = ["all", ...ORDER_STATUS_FLOW] as const;
type FilterStatus = typeof ALL_STATUSES[number];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const { data, isLoading } = useQuery({
    queryKey: ["orders", statusFilter],
    queryFn: () =>
      ordersApi
        .list(statusFilter !== "all" ? { status: statusFilter } : undefined)
        .then((r) => r.data),
  });

  const allOrders: Order[] = data?.results ?? data ?? [];

  const filtered = allOrders.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(q) ||
      (o.customer_name ?? "").toLowerCase().includes(q)
    );
  });

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <PageHeader
        title="Orders"
        subtitle="View and manage all laundry orders"
        action={
          <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 28 }}>
            New Order
          </Button>
        }
      />

      {/* Search + filter */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2.5} alignItems="flex-start">
        <TextField
          size="small"
          placeholder="Search by order # or customer…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          sx={{ width: { xs: "100%", sm: 320 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: "text.disabled" }} />
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip
            icon={<FilterListIcon sx={{ fontSize: "14px !important" }} />}
            label="All"
            variant={statusFilter === "all" ? "filled" : "outlined"}
            color={statusFilter === "all" ? "primary" : "default"}
            size="small"
            onClick={() => { setStatusFilter("all"); setPage(0); }}
            sx={{ fontWeight: 600 }}
          />
          {ORDER_STATUS_FLOW.map((s) => (
            <Chip
              key={s}
              label={STATUS_LABELS[s]}
              variant={statusFilter === s ? "filled" : "outlined"}
              color={statusFilter === s ? "primary" : "default"}
              size="small"
              onClick={() => { setStatusFilter(s); setPage(0); }}
              sx={{ fontWeight: 600 }}
            />
          ))}
        </Stack>
      </Stack>

      {/* Table */}
      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                {["Order #", "Customer", "Status", "Total", "Date", "Items"].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "text.secondary",
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <TableCell key={j}>
                        <Skeleton height={22} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
                : paginated.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <Typography color="text.secondary">No orders found</Typography>
                      </TableCell>
                    </TableRow>
                  )
                  : paginated.map((order) => (
                    <TableRow
                      key={order.id}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:last-child td": { border: 0 },
                        transition: "background 0.1s",
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color="primary.main">
                          {order.order_number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {order.customer_name ?? `Customer #${order.customer}`}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700}>
                          {formatKES(order.total)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDateTime(order.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? "s" : ""}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
          rowsPerPageOptions={[10, 15, 25, 50]}
          sx={{ borderTop: "1px solid", borderColor: "divider" }}
        />
      </Paper>
    </Box>
  );
}
