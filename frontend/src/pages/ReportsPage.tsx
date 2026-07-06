import { useState, useEffect } from "react";
import { Card, Button, Input } from "../components/ui";
import { RevenueChart } from "../components/charts/RevenueChart";
import { ServicePieChart } from "../components/charts/ServicePieChart";
import { OrderStatusChart } from "../components/charts/OrderStatusChart";
import { analytics as analyticsApi, orders as ordersApi } from "../api/endpoints";
import type { ForecastPoint, ServiceDemand } from "../types";
import type { DashboardData } from "../types";

export default function ReportsPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [serviceDemand, setServiceDemand] = useState<ServiceDemand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [dashRes, forecastRes, serviceRes] = await Promise.all([
        ordersApi.dashboard(),
        analyticsApi.forecast(7),
        analyticsApi.serviceDemand(),
      ]);
      setDashboard(dashRes.data);
      setForecast(forecastRes.data);
      setServiceDemand(serviceRes.data);
    } catch {
      // partial data still usable
    } finally {
      setLoading(false);
    }
  }

  function statCard(label: string, value: string | number, icon: string) {
    return (
      <Card className="flex items-center gap-4">
        <img src={icon} alt="" className="w-10 h-10" />
        <div>
          <p className="text-2xl font-bold">{typeof value === "number" ? `KES ${value.toLocaleString()}` : value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Business performance overview</p>
      </div>

      {dashboard && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCard("Orders Today", dashboard.orders_today, "https://img.icons8.com/fluency/48/today.png")}
          {statCard("Revenue Today", dashboard.total_revenue, "https://img.icons8.com/fluency/48/money.png")}
          {statCard("Cash", dashboard.cash, "https://img.icons8.com/fluency/48/cash.png")}
          {statCard("M-Pesa", dashboard.mpesa, "https://img.icons8.com/fluency/48/safari.png")}
        </div>
      )}

      <Card title="Revenue Forecast" icon="https://img.icons8.com/fluency/48/line-chart.png">
        <RevenueChart data={forecast} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Service Demand" icon="https://img.icons8.com/fluency/48/services.png">
          <ServicePieChart data={serviceDemand} />
        </Card>
        <Card title="Order Status" icon="https://img.icons8.com/fluency/48/list.png">
          <OrderStatusChart data={[
            { status: "received", count: dashboard?.orders_today || 0 },
            { status: "washing", count: 0 },
            { status: "drying", count: 0 },
            { status: "ironing", count: 0 },
            { status: "ready", count: dashboard?.overdue_pickups || 0 },
            { status: "delivered", count: 0 },
          ]} />
        </Card>
      </div>
    </div>
  );
}
