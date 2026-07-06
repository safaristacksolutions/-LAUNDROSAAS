interface RevenueChartProps {
  data: { date: string; revenue: number; forecast?: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  if (!data.length) {
    return <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No revenue data</div>;
  }
  const maxVal = Math.max(...data.map((d) => Math.max(d.revenue, d.forecast || 0)), 1);
  const barWidth = Math.max(4, Math.min(24, 600 / data.length));
  return (
    <div className="h-48 flex items-end gap-0.5">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end relative group" title={`${d.date}: KES ${d.revenue.toLocaleString()}`}>
          {d.forecast && (
            <div
              className="w-full bg-blue-200/60 rounded-t"
              style={{ height: `${(d.forecast / maxVal) * 100}%`, minHeight: d.forecast > 0 ? `${barWidth}px` : 0 }}
            />
          )}
          <div
            className="w-full bg-blue-600 rounded-t transition-all hover:bg-blue-500"
            style={{ height: `${(d.revenue / maxVal) * 100}%`, minHeight: d.revenue > 0 ? `${barWidth}px` : 0 }}
          />
        </div>
      ))}
    </div>
  );
}
