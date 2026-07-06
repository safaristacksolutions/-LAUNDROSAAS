const STATUS_COLORS: Record<string, string> = {
  received: "#FBBF24",
  washing: "#3B82F6",
  drying: "#6366F1",
  ironing: "#8B5CF6",
  ready: "#10B981",
  delivered: "#6B7280",
};

const STATUS_LABELS: Record<string, string> = {
  received: "Received",
  washing: "Washing",
  drying: "Drying",
  ironing: "Ironing",
  ready: "Ready",
  delivered: "Delivered",
};

interface OrderStatusChartProps {
  data: { status: string; count: number }[];
}

export function OrderStatusChart({ data }: OrderStatusChartProps) {
  if (!data.length) {
    return <div className="flex items-center justify-center h-32 text-gray-400 text-sm">No order data</div>;
  }
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <div className="space-y-2">
      {data.map((d) => {
        const pct = total > 0 ? (d.count / total) * 100 : 0;
        return (
          <div key={d.status}>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>{STATUS_LABELS[d.status] || d.status}</span>
              <span>{d.count}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: STATUS_COLORS[d.status] || "#3B82F6" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
