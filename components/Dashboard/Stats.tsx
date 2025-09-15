import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Stat {
  title: string;
  value: string | number;
  changeValue: string;
  changeDirection: "up" | "down" | "neutral";
  description: string;
  icon: React.ReactNode;
}

const Stats = ({ stats }: { stats: Stat[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {stats.map((stat, idx) => (
      <Card key={idx} className="p-4 flex flex-col items-center justify-center">
        <div className="mb-2">{stat.icon}</div>
        <div className="text-lg font-bold">{stat.title}</div>
        <div className="text-2xl font-extrabold mt-1">{stat.value}</div>
        <div className="flex items-center gap-2 mt-2">
          {stat.changeDirection === "up" && <span className="text-green-600">▲</span>}
          {stat.changeDirection === "down" && <span className="text-red-600">▼</span>}
          <span className="text-xs text-gray-500">{stat.changeValue}</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">{stat.description}</div>
      </Card>
    ))}
  </div>
);

export default Stats;
