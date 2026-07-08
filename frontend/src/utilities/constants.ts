export const ORDER_STATUS_FLOW = [
  "pending", "received", "sorting", "washing", "drying",
  "ironing", "packaging", "ready", "delivered", "cancelled",
] as const;

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending", received: "Received", sorting: "Sorting",
  washing: "Washing", drying: "Drying", ironing: "Ironing",
  packaging: "Packaging", ready: "Ready", delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B", received: "#3B82F6", sorting: "#8B5CF6",
  washing: "#8B5CF6", drying: "#06B6D4", ironing: "#F97316",
  packaging: "#22C55E", ready: "#22C55E", delivered: "#6B7280",
  cancelled: "#EF4444",
};
