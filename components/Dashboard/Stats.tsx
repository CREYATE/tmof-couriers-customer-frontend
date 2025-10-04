import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Stat {
  title: string;
  value: string | number;
  changeValue: string;
  changeDirection: "up" | "down" | "neutral";
  // description: string;
  icon: React.ReactNode;
}

const Stats = ({ stats }: { stats: Stat[] }) => (
  <>
    {/* Mobile: Horizontal scroll */}
    <div className="md:hidden">
      <div className="flex gap-4 overflow-x-auto pb-4 px-1 scrollbar-hide">
        {stats.map((stat, idx) => (
          <Card key={idx} className="min-w-[280px] flex-shrink-0 p-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-0 flex flex-col items-center justify-center text-center">
              <div className="mb-3 p-3 rounded-full bg-[#ffd215]/10">{stat.icon}</div>
              <div className="text-sm font-medium text-gray-600 mb-1">{stat.title}</div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
              {/* <div className="text-xs text-gray-500">{stat.description}</div> */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    
    {/* Desktop: Grid layout */}
    <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <Card key={idx} className="p-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-0 flex flex-col items-center justify-center text-center">
            <div className="mb-3 p-3 rounded-full bg-[#ffd215]/10">{stat.icon}</div>
            <div className="text-sm font-medium text-gray-600 mb-1">{stat.title}</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
            {/* <div className="text-xs text-gray-500">{stat.description}</div> */}
          </CardContent>
        </Card>
      ))}
    </div>
  </>
);

export default Stats;
