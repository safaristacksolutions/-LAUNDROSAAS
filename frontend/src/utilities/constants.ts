export const ORDER_STATUS_FLOW = [
  "received", "washing", "drying", "ironing", "ready", "delivered",
] as const;

export const STATUS_LABELS: Record<string, string> = {
  received: "Received",
  washing: "Washing",
  drying: "Drying",
  ironing: "Ironing",
  ready: "Ready for Pickup",
  delivered: "Delivered",
};

export const STATUS_COLORS: Record<string, string> = {
  received: "#64748B",
  washing: "#3B82F6",
  drying: "#06B6D4",
  ironing: "#8B5CF6",
  ready: "#10B981",
  delivered: "#14B8A6",
};

export type OrderStatusKey = typeof ORDER_STATUS_FLOW[number];
