import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "../../utils/formatCurrency";

interface Props {
  data: { month: string; revenue: number }[];
}

export default function RevenueChart({ data }: Props) {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const gridColor = isDark ? '#374151' : '#f0f0f0';
  const tickColor = isDark ? '#9ca3af' : '#6b7280';

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-dark dark:text-gray-100 mb-5">Revenue Overview</h3>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF4500" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#FF4500" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: tickColor }} tickFormatter={(v) => `₹${v / 1000}k`} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(v: number | undefined) => [v != null ? formatCurrency(v) : "₹0", "Revenue"]}
            labelStyle={{ fontWeight: 600 }}
            contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', borderRadius: '8px', color: isDark ? '#f3f4f6' : '#111827' }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#FF4500" strokeWidth={2} fill="url(#revGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
