"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    station: "Rajiv Chowk",
    occupancy: 95,
  },
  {
    station: "Kashmere Gate",
    occupancy: 84,
  },
  {
    station: "Central Sec.",
    occupancy: 72,
  },
  {
    station: "Noida 18",
    occupancy: 61,
  },
  {
    station: "Botanical",
    occupancy: 54,
  },
  {
    station: "Dwarka",
    occupancy: 38,
  },
];

const colors = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#3b82f6",
  "#10b981",
  "#06b6d4",
];

export default function StationOccupancyChart() {
  return (
    <div
      className="
      rounded-3xl
      border
      border-border
      bg-card
      p-8
      "
    >
      <div className="mb-8">

        <h2 className="text-2xl font-bold">
          Station Occupancy
        </h2>

        <p className="mt-2 text-muted">
          Live Crowd Distribution
        </p>

      </div>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <BarChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#374151"
          />

          <XAxis
            dataKey="station"
            stroke="#94A3B8"
          />

          <YAxis
            stroke="#94A3B8"
          />

          <Tooltip
            cursor={{
              fill: "rgba(59,130,246,.08)",
            }}
            contentStyle={{
              background: "#111827",
              border: "1px solid #1f2937",
              borderRadius: "16px",
            }}
          />

          <Bar
            dataKey="occupancy"
            radius={[8, 8, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.station}
                fill={colors[index]}
              />
            ))}
          </Bar>

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}