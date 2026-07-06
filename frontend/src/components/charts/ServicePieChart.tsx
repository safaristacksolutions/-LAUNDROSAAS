const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

interface ServicePieChartProps {
  data: { name: string; count: number }[];
}

export function ServicePieChart({ data }: ServicePieChartProps) {
  if (!data.length) {
    return <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No service data</div>;
  }
  const total = data.reduce((s, d) => s + d.count, 0);
  let cumulative = 0;
  return (
    <div className="flex flex-col gap-3">
      {data.map((d, i) => {
        const pct = total > 0 ? (d.count / total) * 100 : 0;
        cumulative += pct;
        return (
          <div key={d.name} className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="flex-1 text-sm text-gray-700">{d.name}</span>
            <span className="text-xs text-gray-500">{pct.toFixed(0)}%</span>
          </div>
        );
      })}
      <div className="w-full bg-gray-100 rounded-full h-2 mt-1 overflow-hidden">
        {data.map((d, i) => {
          const pct = total > 0 ? (d.count / total) * 100 : 0;
          return (
            <div
              key={d.name}
              className="h-full float-left transition-all"
              style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
            />
          );
        })}
      </div>
    </div>
  );
}
