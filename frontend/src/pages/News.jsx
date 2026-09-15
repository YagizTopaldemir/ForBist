import { useEffect, useMemo, useState } from "react";
import { Newspaper, ExternalLink, ImageOff } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const TABS = [
  { key: "turkey", label: "Türkiye" },
  { key: "us", label: "ABD" },
];

function getDayLabel(publishedAt) {
  const date = new Date(publishedAt);
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  if (date >= startOfToday) return "Bugün";

  if (date >= startOfYesterday) return "Dün";

  return "Daha Önce";
}

function formatTime(publishedAt) {
  return new Date(publishedAt).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function groupByDay(items) {
  const groups = { Bugün: [], Dün: [] };

  items.forEach((item) => {
    const label = getDayLabel(item.publishedAt);

    if (!groups[label]) groups[label] = [];

    groups[label].push(item);
  });

  return Object.entries(groups).filter(
    ([, group]) => group.length > 0
  );
}

export default function News() {
  const [news, setNews] = useState({ turkey: [], us: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("turkey");

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/news",
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Haberler alınamadı.");
        }

        const result = await response.json();

        setNews(result.data || { turkey: [], us: [] });
      } catch (err) {
        console.error("Haber hatası:", err);
        setError("Haberler yüklenirken bir sorun oluştu.");
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const activeItems = news[activeTab] || [];

  const groupedItems = useMemo(
    () => groupByDay(activeItems),
    [activeItems]
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0A0A0F] text-white">
      <Sidebar />

      <div className="ml-0 md:ml-64">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
                Haberler
              </h1>

              <p className="mt-2 text-sm text-gray-400">
                Bugün ve dünkü borsa gündemini takip et.
              </p>
            </div>

            <div className="flex w-full rounded-xl border border-white/10 bg-white/[0.03] p-1 sm:w-fit">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm transition sm:flex-none ${
                    activeTab === tab.key
                      ? "bg-violet-500/20 text-violet-300"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <h2 className="text-base font-medium">
                  {activeTab === "turkey"
                    ? "Türkiye Piyasa Gündemi"
                    : "ABD Piyasa Gündemi"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === "turkey"
                    ? "Anadolu Ajansı ekonomi haberleri"
                    : "MarketWatch öne çıkan haberler"}
                </p>
              </div>

              <div className="rounded-xl bg-violet-500/10 p-2.5">
                <Newspaper size={18} className="text-violet-400" />
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-violet-400" />
                  Haberler yükleniyor...
                </div>
              </div>
            ) : error ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <p className="text-sm text-gray-500">{error}</p>
              </div>
            ) : groupedItems.length === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <p className="text-sm text-gray-500">
                  Bugün veya dün için haber bulunamadı.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {groupedItems.map(([day, items]) => (
                  <div key={day} className="p-5">
                    <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-gray-500">
                      {day}
                    </p>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {items.map((item) => (
                        <a
                          key={item.link}
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition duration-300 hover:border-violet-500/20 hover:bg-violet-500/[0.03]"
                        >
                          <div className="aspect-[16/9] w-full overflow-hidden bg-white/[0.03]">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-700">
                                <ImageOff size={20} />
                              </div>
                            )}
                          </div>

                          <div className="flex flex-1 flex-col p-4">
                            <h3 className="line-clamp-2 text-sm font-medium text-gray-200">
                              {item.title}
                            </h3>

                            <p className="mt-2 line-clamp-2 flex-1 text-xs leading-5 text-gray-500">
                              {item.summary}
                            </p>

                            <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
                              <span>
                                {item.source} · {formatTime(item.publishedAt)}
                              </span>

                              <ExternalLink
                                size={14}
                                className="text-gray-600 transition group-hover:text-violet-400"
                              />
                            </div>
                          </div>
                        </a>
                      ))}
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
