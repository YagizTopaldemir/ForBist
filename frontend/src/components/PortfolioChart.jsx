import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PortfolioChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/portfolio/history",
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Portföy geçmişi alınamadı.");
        }

        const result = await response.json();

        setData(result.data);
      } catch (error) {
        console.error("Portfolio chart error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const chartData =
  data.length > 0
    ? data
    : [{ name: "Bugün", value: 0 }];

const latestValue =
  data.length > 0 ? data[data.length - 1].value : 0;
  const formatMoney = (value) => {
    return Number(value).toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          Portföy Performansı
        </p>

        <div className="mt-2 flex items-end gap-3">
          <h2 className="text-2xl font-normal text-gray-100">
            ₺{formatMoney(latestValue)}
          </h2>
        </div>
      </div>

      <div className="h-[300px]">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            Yükleniyor...
          </div>
        ) :  (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="portfolioGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#8B5CF6"
                    stopOpacity={0.35}
                  />

                  <stop
                    offset="100%"
                    stopColor="#8B5CF6"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#6B7280",
                  fontSize: 12,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#6B7280",
                  fontSize: 12,
                }}
                tickFormatter={(value) =>
                  `₺${value / 1000}K`
                }
              />

              <Tooltip
                contentStyle={{
                  background: "#111118",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                formatter={(value) => [
                  `₺${Number(value).toLocaleString("tr-TR")}`,
                  "Portföy",
                ]}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#8B5CF6"
                strokeWidth={2}
                fill="url(#portfolioGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}