import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "../api/ordersApi";
import { DataTable, type Column } from "../../../components/tables/DataTable";
import { StatusBadge } from "../../../components/data-display/StatusBadge";
import { formatKES, formatDate } from "../../../utilities/formatters";
import type { Order } from "../../../types";
import { useNavigate } from "react-router-dom";

const columns: Column<Order>[] = [
  { key: "order_number", label: "Order #", render: (r) => r.order_number, width: 120 },
  { key: "customer_name", label: "Customer", render: (r) => r.customer_name ?? `#${r.customer}` },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} />, width: 100 },
  { key: "total_kes", label: "Total", render: (r) => formatKES(r.total_kes), width: 100 },
  { key: "created_at", label: "Date", render: (r) => formatDate(r.created_at), width: 100 },
];

export function OrdersTable() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => ordersApi.list().then((r) => r.data),
  });

  const orders: Order[] = data?.results ?? data ?? [];

  return (
    <DataTable
      columns={columns}
      data={orders}
      loading={isLoading}
      onRowClick={(row) => navigate(`/orders/${row.id}`)}
    />
  );
}
