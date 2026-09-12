import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import PortfolioChart from "../components/PortfolioChart";
import { LoaderCircle } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  const [portfolioSummary, setPortfolioSummary] = useState({
    totalValue: 0,
    totalCost: 0,
    profitLoss: 0,
    profitLossPercent: 0,
  });

  const [loading, setLoading] = useState(true);
  const [market, setMarket] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          userResponse,
          summaryResponse,
          marketResponse,
        ] = await Promise.all([
          fetch("http://localhost:3000/api/auth/me", {
            credentials: "include",
            cache: "no-store",
          }),

          fetch("http://localhost:3000/api/portfolio/summary", {
            credentials: "include",
            cache: "no-store",
          }),

          fetch("http://localhost:3000/api/market", {
            cache: "no-store",
          }),
        ]);

        if (
          !userResponse.ok ||
          !summaryResponse.ok ||
          !marketResponse.ok
        ) {
          throw new Error("Dashboard verileri alınamadı.");
        }

        const userData = await userResponse.json();
        const summaryData = await summaryResponse.json();
        const marketData = await marketResponse.json();

        setUser(userData.user);
        setPortfolioSummary(summaryData.data);
        setMarket(marketData.data);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const formatMoney = (value) => {
    return Number(value).toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const profitPositive = portfolioSummary.profitLoss >= 0;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0A0A0F] text-white">
      <Sidebar />

      <div className="ml-0 md:ml-64">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="flex min-h-[calc(100vh-130px)] items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
                  <LoaderCircle
                    size={26}
                    className="animate-spin text-violet-400"
                  />
                </div>

                <p className="mt-4 text-sm font-medium text-gray-300">
                  Dashboard yükleniyor
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  Portföy ve piyasa verileri hazırlanıyor...
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-col gap-5 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
                    Hoş geldin, {user?.name}
                  </h1>

                  <p className="mt-2 text-sm text-gray-400">
                    Portföyünün genel durumuna göz at.
                  </p>
                </div>

                <div className="flex w-full rounded-xl border border-white/10 bg-white/[0.03] p-1 sm:w-fit">
                  {["Hafta", "Ay", "Yıl"].map((item) => (
                    <button
                      key={item}
                      className={`flex-1 rounded-lg px-4 py-2 text-sm transition sm:flex-none ${
                        item === "Yıl"
                          ? "bg-violet-500/20 text-violet-300"
                          : "text-gray-500 hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Portföy Getiri"
                  value={`₺ ${formatMoney(
                    portfolioSummary.profitLoss
                  )}`}
                  change={`%${Number(
                    portfolioSummary.profitLossPercent
                  ).toFixed(2)}`}
                  positive={profitPositive}
                />

                <StatCard
                  title="BIST 100"
                  value={market?.bist100?.value?.toLocaleString(
                    "tr-TR"
                  )}
                  change={`%${market?.bist100?.change}`}
                  positive={market?.bist100?.change >= 0}
                />

                <StatCard
                  title="Gram Altın"
                  value={`₺ ${market?.gold?.value?.toLocaleString(
                    "tr-TR"
                  )}`}
                  change={`%${market?.gold?.change}`}
                  positive={market?.gold?.change >= 0}
                />

                <StatCard
                  title="Portföy Toplamı"
                  value={`₺ ${formatMoney(
                    portfolioSummary.totalValue
                  )}`}
                />
              </div>

              <div className="mt-4 sm:mt-5">
                <PortfolioChart />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}