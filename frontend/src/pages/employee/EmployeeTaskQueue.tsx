import { useEffect, useState } from "react";
import { orders as ordersApi } from "../../api/endpoints";
import type { Order } from "../../types";
import toast from "react-hot-toast";

export default function EmployeeTaskQueue() {
  const [pending, setPending] = useState<Order[]>([]);
  const [inProgress, setInProgress] = useState<Order[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const { data } = await ordersApi.list();
      setPending(data.filter((o) => o.status === "received"));
      setInProgress(data.filter((o) => ["washing", "drying", "ironing"].includes(o.status)));
      setCompletedCount(data.filter((o) => o.status === "delivered").length);
    } catch {}
  };

  const startOrder = async (order: Order) => {
    try {
      await ordersApi.updateStatus(order.id, "washing");
      toast.success(`Started washing #${order.order_number}`);
      loadOrders();
    } catch { toast.error("Failed"); }
  };

  const markDone = async (order: Order) => {
    const map: Record<string, string> = { washing: "drying", drying: "ironing", ironing: "ready" };
    const next = map[order.status] || "washing";
    try {
      await ordersApi.updateStatus(order.id, next);
      toast.success(`#${order.order_number} → ${next}`);
      loadOrders();
    } catch { toast.error("Failed"); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <img src="https://img.icons8.com/fluency/48/task.png" alt="" className="w-8 h-8" />
          <h1 className="text-xl font-bold">Employee Task Queue</h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6">
        {/* Pending */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <img src="https://img.icons8.com/fluency/48/hourglass.png" alt="" className="w-5 h-5" />
            <h2 className="font-semibold">Pending ({pending.length})</h2>
          </div>
          <div className="space-y-2">
            {pending.map((order) => (
              <div key={order.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="font-medium text-sm">#{order.order_number}</div>
                <div className="text-xs text-gray-500">{order.customer_name}</div>
                <div className="text-xs text-gray-400 mt-1">{order.items.map((i) => i.service_name).join(", ")}</div>
                <button className="mt-2 w-full py-2 bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all" onClick={() => startOrder(order)}>
                  🧺 Start Washing
                </button>
              </div>
            ))}
            {pending.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <img src="https://img.icons8.com/fluency/96/checked--v1.png" alt="" className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">All caught up!</p>
              </div>
            )}
          </div>
        </div>

        {/* In Progress */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <img src="https://img.icons8.com/fluency/48/progress.png" alt="" className="w-5 h-5" />
            <h2 className="font-semibold">In Progress ({inProgress.length})</h2>
          </div>
          <div className="space-y-2">
            {inProgress.map((order) => (
              <div key={order.id} className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <div className="font-medium text-sm">#{order.order_number}</div>
                <div className="text-xs text-blue-600 font-medium bg-blue-100 inline-block px-2 py-0.5 rounded-full mt-1">
                  {order.status.toUpperCase()}
                </div>
                <button className="mt-2 w-full py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white text-sm rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all" onClick={() => markDone(order)}>
                  ✅ Mark Complete
                </button>
              </div>
            ))}
            {inProgress.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">No active tasks</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <img src="https://img.icons8.com/fluency/48/bar-chart.png" alt="" className="w-5 h-5" />
            <h2 className="font-semibold">Today</h2>
          </div>
          <div className="text-center py-8">
            <img src="https://img.icons8.com/fluency/96/checked--v1.png" alt="" className="w-16 h-16 mx-auto mb-3" />
            <div className="text-5xl font-bold text-green-600">{completedCount}</div>
            <div className="text-gray-500 mt-2 font-medium">Completed</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">⏳ Pending</span><span className="font-medium">{pending.length}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">🔄 Active</span><span className="font-medium">{inProgress.length}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">✅ Done</span><span className="font-medium">{completedCount}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
