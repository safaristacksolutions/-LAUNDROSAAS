import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

interface TenantOverview {
  id: number; name: string; phone: string; plan: string; is_active: boolean; status: "healthy" | "at_risk" | "critical";
}

export default function SuperAdminPanel() {
  const user = useAuthStore((s) => s.user);
  const [tenants] = useState<TenantOverview[]>([
    { id: 1, name: "FreshWash Kilimani", phone: "0712 345 678", plan: "Pro", is_active: true, status: "healthy" },
    { id: 2, name: "CleanWave Mombasa", phone: "0723 456 789", plan: "Starter", is_active: true, status: "at_risk" },
    { id: 3, name: "QuickWash Nakuru", phone: "0734 567 890", plan: "Pro", is_active: false, status: "critical" },
  ]);

  const statusColors: Record<string, string> = {
    healthy: "text-green-600 bg-green-50 border-green-200",
    at_risk: "text-yellow-600 bg-yellow-50 border-yellow-200",
    critical: "text-red-600 bg-red-50 border-red-200",
  };

  const healthy = tenants.filter((t) => t.status === "healthy").length;
  const atRisk = tenants.filter((t) => t.status === "at_risk").length;
  const critical = tenants.filter((t) => t.status === "critical").length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://img.icons8.com/fluency/48/settings.png" alt="" className="w-8 h-8" />
            <h1 className="text-xl font-bold">LaundroSaaS SuperAdmin</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{user?.email || "admin@laundrosaas.com"}</span>
            <button onClick={() => useAuthStore.getState().logout()} className="text-gray-500 hover:text-gray-300">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Revenue Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 shadow-lg">
            <div className="text-sm text-white/60">Monthly Revenue</div>
            <div className="text-3xl font-bold mt-1">KES 847K</div>
            <div className="text-sm text-green-300 mt-1">↑ 18% vs last month</div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="text-sm text-gray-400">Active Tenants</div>
            <div className="text-3xl font-bold mt-1">{tenants.length}</div>
            <div className="text-sm text-gray-500 mt-1">{healthy} healthy</div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 border border-yellow-700/30">
            <div className="text-sm text-gray-400">At Risk</div>
            <div className="text-3xl font-bold mt-1 text-yellow-400">{atRisk}</div>
            <div className="text-sm text-gray-500 mt-1">Needs attention</div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 border border-red-700/30">
            <div className="text-sm text-gray-400">Critical</div>
            <div className="text-3xl font-bold mt-1 text-red-400">{critical}</div>
            <div className="text-sm text-gray-500 mt-1">Will churn</div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="font-semibold mb-6 flex items-center gap-2">
            <img src="https://img.icons8.com/fluency/48/revenue.png" alt="" className="w-5 h-5" />
            Revenue Breakdown
          </h2>
          <div className="space-y-4">
            {[
              { label: "Subscriptions", pct: 74, amount: "KES 623,000", color: "bg-blue-500" },
              { label: "M-Pesa Fees", pct: 22, amount: "KES 189,000", color: "bg-green-500" },
              { label: "SMS Credits", pct: 3, amount: "KES 28,000", color: "bg-yellow-500" },
              { label: "Hardware", pct: 1, amount: "KES 7,000", color: "bg-purple-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-28 text-sm text-gray-400">{item.label}</div>
                <div className="flex-1 h-5 bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.pct}%` }} />
                </div>
                <div className="text-sm font-mono w-28 text-right">{item.amount}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tenant Table */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold flex items-center gap-2">
              <img src="https://img.icons8.com/fluency/48/building.png" alt="" className="w-5 h-5" />
              Tenants
            </h2>
            <button className="px-4 py-2 bg-brand-600 rounded-xl text-sm font-medium hover:bg-brand-700 transition-all hover:scale-105">
              + Add Tenant
            </button>
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-900">
                <tr className="text-gray-400">
                  <th className="text-left py-3 px-4">Tenant</th>
                  <th className="text-left py-3 px-4">Phone</th>
                  <th className="text-left py-3 px-4">Plan</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{t.name}</td>
                    <td className="py-3 px-4 text-gray-400">{t.phone}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.plan === "Pro" ? "bg-brand-600/20 text-brand-400" : "bg-gray-700 text-gray-300"}`}>
                        {t.plan}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[t.status]}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-brand-400 hover:text-brand-300 text-xs font-medium mr-3">Retain</button>
                      <button className="text-gray-400 hover:text-gray-300 text-xs">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Churn Prediction */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <img src="https://img.icons8.com/fluency/48/forecast.png" alt="" className="w-5 h-5" />
            Churn Prediction (Next 30 Days)
          </h2>
          <div className="space-y-3">
            {[
              { name: "CleanWave Mombasa", reason: "No orders in 5 days", severity: "critical" },
              { name: "QuickWash Nakuru", reason: "Payment failed 2x", severity: "warning" },
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${item.severity === "critical" ? "bg-red-900/20 border-red-800/30" : "bg-yellow-900/20 border-yellow-800/30"}`}>
                <div>
                  <span className="font-medium">{item.name}</span>
                  <p className="text-sm text-gray-400">{item.reason}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-brand-600 rounded-lg text-xs font-medium hover:bg-brand-700 transition-colors">Call Owner</button>
                  <button className="px-3 py-1.5 bg-gray-700 rounded-lg text-xs font-medium hover:bg-gray-600 transition-colors">Offer Discount</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
