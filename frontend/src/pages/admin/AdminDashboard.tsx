import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { orders as ordersApi, rent as rentApi } from "../../api/endpoints";
import type { DashboardData, RentHealth } from "../../types";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [rentHealth, setRentHealth] = useState<RentHealth | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [dashRes, rentRes] = await Promise.all([
        ordersApi.dashboard(),
        rentApi.health(),
      ]);
      setDashboard(dashRes.data);
      setRentHealth(rentRes.data);
    } catch {}
  };

  const rentColors: Record<string, string> = {
    paid: "from-emerald-600 to-emerald-500",
    safe: "from-green-600 to-green-500",
    warning: "from-yellow-500 to-amber-500",
    critical: "from-red-600 to-rose-500",
    not_setup: "from-gray-400 to-gray-500",
  };

  const rentBarColors: Record<string, string> = {
    paid: "bg-emerald-400",
    safe: "bg-green-400",
    warning: "bg-yellow-400",
    critical: "bg-red-400",
    not_setup: "bg-gray-400",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://img.icons8.com/fluency/48/dashboard.png" alt="" className="w-8 h-8" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/pos" className="text-gray-400 hover:text-gray-600">POS</Link>
            <Link to="/employee" className="text-gray-400 hover:text-gray-600">Staff</Link>
            <span className="text-gray-500">{user?.first_name || user?.username}</span>
            <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">admin</span>
            <button onClick={() => useAuthStore.getState().logout()} className="text-gray-400 hover:text-gray-600">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Rent Health Hero */}
        {rentHealth && rentHealth.status !== "not_setup" ? (
          <div className={`rounded-2xl p-8 text-white bg-gradient-to-br ${rentColors[rentHealth.status] || "from-brand-600 to-brand-700"} shadow-xl`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 opacity-80 mb-1">
                  <img src="https://img.icons8.com/fluency/48/rent.png" alt="" className="w-5 h-5" />
                  <span className="text-sm font-medium">Rent Health</span>
                </div>
                <h2 className="text-3xl font-bold mt-2">KES {rentHealth.monthly_rent?.toLocaleString() || "—"}</h2>
                <p className="text-white/70 text-sm mt-1">Due in {rentHealth.days_until_due} days</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold">{rentHealth.reserve_percent}%</div>
                <div className="text-sm opacity-80">reserved</div>
              </div>
            </div>

            <div className="mt-6 h-4 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${rentBarColors[rentHealth.status]}`}
                style={{ width: `${Math.min(rentHealth.reserve_percent || 0, 100)}%` }}
              />
            </div>

            <div className="mt-3 flex justify-between text-sm text-white/80">
              <span>Reserve: KES {rentHealth.reserve_amount?.toLocaleString() || "0"}</span>
              <span>Target: KES {rentHealth.monthly_rent?.toLocaleString() || "—"}</span>
            </div>

            <p className="mt-4 text-lg font-medium">{rentHealth.message}</p>

            {rentHealth.projected && (
              <p className="mt-1 text-sm opacity-80">📊 Projected by due date: KES {rentHealth.projected.toLocaleString()}</p>
            )}

            <div className="mt-4 flex gap-3">
              <button className="px-5 py-2 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-all hover:scale-105 backdrop-blur-sm">
                + Add to Reserve
              </button>
              <button className="px-5 py-2 bg-white/10 rounded-xl text-sm font-medium hover:bg-white/20 transition-all backdrop-blur-sm">
                Adjust Rent
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl p-8 bg-gradient-to-br from-gray-700 to-gray-800 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <img src="https://img.icons8.com/fluency/48/rent.png" alt="" className="w-10 h-10" />
              <div>
                <h2 className="text-xl font-bold">Rent Health</h2>
                <p className="text-white/60 text-sm">Configure your rent to get started</p>
              </div>
            </div>
            <button className="px-5 py-2 bg-brand-600 rounded-xl text-sm font-medium hover:bg-brand-700 transition-all">
              + Set Up Rent Reserve
            </button>
          </div>
        )}

        {/* Stats */}
        {dashboard && (
          <div className="grid grid-cols-4 gap-4">
            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <img src="https://img.icons8.com/fluency/48/order.png" alt="" className="w-10 h-10" />
                <div>
                  <div className="text-2xl font-bold">{dashboard.orders_today}</div>
                  <div className="text-xs text-gray-500">Orders Today</div>
                </div>
              </div>
            </div>
            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <img src="https://img.icons8.com/fluency/48/money.png" alt="" className="w-10 h-10" />
                <div>
                  <div className="text-2xl font-bold text-green-600">KES {dashboard.total_revenue?.toLocaleString() || "0"}</div>
                  <div className="text-xs text-gray-500">Revenue Today</div>
                </div>
              </div>
            </div>
            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <img src="https://img.icons8.com/fluency/48/mpesa.png" alt="" className="w-10 h-10" />
                <div>
                  <div className="text-lg font-bold text-green-600">KES {dashboard.mpesa?.toLocaleString() || "0"}</div>
                  <div className="text-xs text-gray-500">M-Pesa</div>
                </div>
              </div>
            </div>
            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <img src="https://img.icons8.com/fluency/48/cash.png" alt="" className="w-10 h-10" />
                <div>
                  <div className="text-lg font-bold">KES {dashboard.cash?.toLocaleString() || "0"}</div>
                  <div className="text-xs text-gray-500">Cash</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Items + Employee Perf */}
        <div className="grid grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <img src="https://img.icons8.com/fluency/48/alarm.png" alt="" className="w-5 h-5" />
              Needs Attention
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-medium">Overdue Pickups</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-red-600 text-lg">{dashboard?.overdue_pickups || 0}</span>
                  <button className="text-xs text-red-600 hover:underline font-medium">Send reminder</button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm font-medium">Pending Payments</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-yellow-600 text-lg">{dashboard?.pending_payments || 0}</span>
                  <button className="text-xs text-yellow-600 hover:underline font-medium">Retry</button>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <img src="https://img.icons8.com/fluency/48/team.png" alt="" className="w-5 h-5" />
              Staff Today
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Kevin (Cashier)</span>
                  <span className="text-gray-500">{dashboard?.orders_today || 0} orders</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-500" style={{ width: "70%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Mary (Washer)</span>
                  <span className="text-gray-500">15 items</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500" style={{ width: "50%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">John (Ironer)</span>
                  <span className="text-gray-500">12 items</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500" style={{ width: "40%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Billing */}
        <div className="card">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <img src="https://img.icons8.com/fluency/48/billing.png" alt="" className="w-5 h-5" />
            Subscription & Billing
          </h3>
          <div className="grid grid-cols-4 gap-6 text-sm">
            <div className="p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-500 text-xs">Plan</span>
              <p className="font-bold text-lg mt-1">Pro</p>
              <p className="text-brand-600 font-medium">KES 4,999/mo</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-500 text-xs">Next Billing</span>
              <p className="font-bold text-lg mt-1">Aug 1</p>
              <p className="text-gray-400 text-xs">M-Pesa auto-debit</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-500 text-xs">Orders This Month</span>
              <p className="font-bold text-lg mt-1">487</p>
              <p className="text-gray-400 text-xs">Unlimited plan</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-500 text-xs">M-Pesa Processed</span>
              <p className="font-bold text-lg mt-1">KES 234K</p>
              <p className="text-gray-400 text-xs">Fee: KES 3,510 (1.5%)</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
