import { useState, useEffect } from "react";
import { Card, Table, StatusBadge, Button, Input } from "../components/ui";
import { orders as ordersApi } from "../api/endpoints";
import type { Order } from "../types";

const COLUMNS = [
  { key: "order_number", header: "Order #" },
  { key: "customer_name", header: "Customer" },
  { key: "total_kes", header: "Total" },
  {
    key: "status",
    header: "Status",
    render: (o: Order) => <StatusBadge status={o.status} />,
  },
  { key: "created_at", header: "Date" },
  {
    key: "is_paid",
    header: "Payment",
    render: (o: Order) => (
      <span className={o.is_paid ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
        {o.is_paid ? "Paid" : "Unpaid"}
      </span>
    ),
  },
];

export default function OrdersPage() {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  async function loadOrders() {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const { data } = await ordersApi.list(params);
      setData(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all laundry orders</p>
        </div>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          {["", "received", "washing", "drying", "ironing", "ready", "delivered"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                statusFilter === s
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
            </button>
          ))}
        </div>
        <Table columns={COLUMNS} data={data} keyExtractor={(o) => o.id} loading={loading} />
      </Card>
    </div>
  );
}
