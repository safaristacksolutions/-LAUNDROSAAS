import clsx from "clsx";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const STATUS_COLORS: Record<string, string> = {
  received: "bg-yellow-100 text-yellow-800",
  washing: "bg-blue-100 text-blue-800",
  drying: "bg-indigo-100 text-indigo-800",
  ironing: "bg-purple-100 text-purple-800",
  ready: "bg-green-100 text-green-800",
  delivered: "bg-gray-100 text-gray-800",
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
  cancelled: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  received: "Received",
  washing: "Washing",
  drying: "Drying",
  ironing: "Ironing",
  ready: "Ready for Pickup",
  delivered: "Delivered",
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
  cancelled: "Cancelled",
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const color = STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
  const label = STATUS_LABELS[status] || status;
  return (
    <span className={clsx("inline-flex items-center rounded-full font-medium", color, size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm")}>
      {label}
    </span>
  );
}
