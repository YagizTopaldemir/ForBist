import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  CalendarDays,
  Clock3,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

const MONTHS = {
  Ocak: 0,
  Şubat: 1,
  Mart: 2,
  Nisan: 3,
  Mayıs: 4,
  Haziran: 5,
  Temmuz: 6,
  Ağustos: 7,
  Eylül: 8,
  Ekim: 9,
  Kasım: 10,
  Aralık: 11,
};

function getIpoDateRange(dates) {
  if (!dates) return null;

  const match = dates.match(
    /^([\d-]+)\s+([A-Za-zÇçĞğİıÖöŞşÜü]+)\s+(\d{4})$/
  );

  if (!match) return null;

  const dayPart = match[1];
  const monthName = match[2];
  const year = Number(match[3]);

  const days = dayPart.split("-").map(Number);

  const month = MONTHS[monthName];

  if (month === undefined) return null;

  const startDate = new Date(year, month, days[0]);
  const endDate = new Date(year, month, days[days.length - 1]);

  // Günün tamamını kapsasın
  endDate.setHours(23, 59, 59, 999);

  return {
    startDate,
    endDate,
    year,
  };
}

function getIpoStatus(dates) {
  const range = getIpoDateRange(dates);

  if (!range) return "Bilinmiyor";

  const today = new Date();

  if (today < range.startDate) {
    return "Yaklaşan";
  }

  if (today <= range.endDate) {
    return "Talep toplanıyor";
  }

  return "Tamamlandı";
}

export default function Ipo() {
  const [ipos, setIpos] = useState([]);
  const [stats, setStats] = useState({
    thisYear: 0,
    active: 0,
    upcoming: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIpos() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/ipos"
        );

        if (!response.ok) {
          throw new Error("Halka arz verileri alınamadı");
        }

        const result = await response.json();

        console.log("ForBist API:", result);

        const currentYear = new Date().getFullYear();

        const processedIpos = result.data.map((ipo) => ({
          ...ipo,
          status: getIpoStatus(ipo.dates),
        }));

        const thisYearIpos = processedIpos.filter((ipo) => {
          const range = getIpoDateRange(ipo.dates);

          return range?.year === currentYear;
        });

        const activeIpos = thisYearIpos.filter(
          (ipo) => ipo.status === "Talep toplanıyor"
        );

        const upcomingIpos = thisYearIpos.filter(
          (ipo) => ipo.status === "Yaklaşan"
        );

        const completedIpos = thisYearIpos.filter(
          (ipo) => ipo.status === "Tamamlandı"
        );

        setIpos(processedIpos);

        setStats({
          thisYear: thisYearIpos.length,
          active: activeIpos.length,
          upcoming: upcomingIpos.length,
          completed: completedIpos.length,
        });
      } catch (error) {
        console.error("Halka arz hatası:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchIpos();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0A0A0F] text-white">
      <Sidebar />

      <div className="ml-0 md:ml-64">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
              Halka Arzlar
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Güncel ve yaklaşan halka arzları takip et.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-violet-500/10 p-2.5">
                  <CalendarDays
                    size={18}
                    className="text-violet-400"
                  />
                </div>

                <p className="text-sm text-gray-500">
                  Bu Yıl
                </p>
              </div>

              <h2 className="mt-4 text-2xl font-normal">
                {stats.thisYear}
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Halka arz
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500/10 p-2.5">
                  <Clock3
                    size={18}
                    className="text-emerald-400"
                  />
                </div>

                <p className="text-sm text-gray-500">
                  Talep Toplayan
                </p>
              </div>

              <h2 className="mt-4 text-2xl font-normal">
                {stats.active}
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Aktif halka arz
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/10 p-2.5">
                  <ArrowUpRight
                    size={18}
                    className="text-blue-400"
                  />
                </div>

                <p className="text-sm text-gray-500">
                  Yaklaşan
                </p>
              </div>

              <h2 className="mt-4 text-2xl font-normal">
                {stats.upcoming}
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Beklenen arz
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/5 p-2.5">
                  <CheckCircle2
                    size={18}
                    className="text-gray-400"
                  />
                </div>

                <p className="text-sm text-gray-500">
                  Tamamlanan
                </p>
              </div>

              <h2 className="mt-4 text-2xl font-normal">
                {stats.completed}
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {new Date().getFullYear()} yılında
              </p>
            </div>
          </div>

          {/* IPO List */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="border-b border-white/10 p-5">
              <h2 className="text-base font-medium">
                Halka Arz Takvimi
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Güncel halka arzlar
              </p>
            </div>

            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-violet-400" />
                  Halka arzlar yükleniyor...
                </div>
              </div>
            ) : ipos.length === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <p className="text-sm text-gray-500">
                  Halka arz verisi bulunamadı.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {ipos.map((ipo) => (
                  <div
                    key={ipo.symbol}
                    className="flex flex-col gap-5 p-5 transition hover:bg-white/[0.025] lg:flex-row lg:items-center lg:justify-between"
                  >
                    {/* Company */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-sm font-medium text-violet-300">
                        {ipo.symbol.slice(0, 2)}
                      </div>

                      <div>
                        <p className="font-medium text-gray-200">
                          {ipo.symbol}
                        </p>

                        <p className="mt-1 max-w-md text-sm text-gray-500">
                          {ipo.company}
                        </p>
                      </div>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-xs text-gray-500">
                        Talep Toplama
                      </p>

                      <p className="mt-1 text-sm text-gray-300">
                        {ipo.dates}
                      </p>
                    </div>

                    {/* Price */}
                    <div>
                      <p className="text-xs text-gray-500">
                        Halka Arz Fiyatı
                      </p>

                      <p className="mt-1 text-sm text-gray-200">
                        {ipo.price || "-"}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between gap-4 lg:justify-end">
                      <span
                        className={`rounded-lg px-3 py-1.5 text-xs ${
                          ipo.status === "Talep toplanıyor"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : ipo.status === "Yaklaşan"
                              ? "bg-blue-500/10 text-blue-400"
                              : ipo.status === "Tamamlandı"
                                ? "bg-white/5 text-gray-400"
                                : "bg-white/5 text-gray-500"
                        }`}
                      >
                        {ipo.status}
                      </span>

                      <a
                        href={ipo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-white"
                      >
                        <ArrowUpRight size={17} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}