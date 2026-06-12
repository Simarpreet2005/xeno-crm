import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function AnalyticsChart({ analytics }) {
  if (!analytics) return <p style={{ color: "var(--text)" }}>No analytics data available</p>;

  const data = [
    { name: "Delivered", value: analytics.delivered || 0, color: "#a855f7" },
    { name: "Opened", value: analytics.opened || 0, color: "#3b82f6" },
    { name: "Read", value: analytics.read || 0, color: "#10b981" },
    { name: "Clicked", value: analytics.clicked || 0, color: "#f59e0b" },
  ];

  return (
    <div style={{ width: "100%", height: 300, marginTop: "20px" }}>
      <ResponsiveContainer width="99%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" stroke="var(--text)" fontSize={12} />
          <YAxis stroke="var(--text)" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--code-bg)",
              borderColor: "var(--border)",
              color: "var(--text-h)",
              borderRadius: "6px",
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AnalyticsChart;
