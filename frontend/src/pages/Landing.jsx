// src/pages/Landing.jsx

import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Brain,
  ShieldCheck,
  Newspaper,
  TrendingUp,
  PieChart,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: PieChart,
    title: "Portföyünü tek yerde yönet",
    description:
      "Hisselerini, maliyetlerini ve toplam getirini sade bir arayüz üzerinden takip et.",
  },
  {
    icon: TrendingUp,
    title: "Piyasanı takip et",
    description:
      "BIST 100, altın ve portföy performansını tek ekranda karşılaştır.",
  },
  {
    icon: Brain,
    title: "Yapay zekâ ile analiz et",
    description:
      "Portföyündeki hisseler hakkında kısa, anlaşılır ve veriye dayalı analizler al.",
  },
  {
    icon: Newspaper,
    title: "Piyasa gündemini kaçırma",
    description:
      "BIST haberlerini ve önemli piyasa gelişmelerini tek merkezden takip et.",
  },
];

const stats = [
  ["Portföy", "Takibi"],
  ["BIST", "Verileri"],
  ["AI", "Analiz"],
  ["Piyasa", "Haberleri"],
];

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#08080D] text-white">
      {/* NAVBAR */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-[#08080D]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500">
              <BarChart3 size={19} strokeWidth={2.5} />
            </div>

            <span className="text-xl font-semibold tracking-tight">
              ForBist
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#ozellikler"
              className="text-sm text-gray-400 transition hover:text-white"
            >
              Özellikler
            </a>

            <a
              href="#nasil"
              className="text-sm text-gray-400 transition hover:text-white"
            >
              Nasıl Çalışır?
            </a>

            <a
              href="#ai"
              className="text-sm text-gray-400 transition hover:text-white"
            >
              AI Asistan
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="hidden px-4 py-2.5 text-sm text-gray-300 transition hover:text-white sm:block"
            >
              Giriş Yap
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-gray-200"
            >
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main>
        <section className="relative px-5 pb-24 pt-36 sm:px-8 sm:pt-44 lg:pb-32">
          <div className="pointer-events-none absolute left-1/2 top-20 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/[0.10] blur-[140px]" />

          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              

              <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Yatırımlarını daha
                <span className="block bg-gradient-to-r from-violet-300 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  akıllıca takip et.
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
                ForBist ile portföyünü takip et, BIST piyasasını izle ve
                yapay zekâ destekli analizlerle yatırımlarını daha anlaşılır
                hale getir.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/register"
                   data-aos="fade-up"
  data-aos-duration="800"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-6 py-3.5 text-sm font-medium transition hover:bg-violet-400"
                >
                  Ücretsiz Başla
                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-0.5"
                  />
                </Link>

                <a
                  href="#ozellikler"
                   data-aos="fade-up"
  data-aos-duration="800"
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm text-gray-300 transition hover:bg-white/[0.06] hover:text-white"
                >
                  Özellikleri İncele
                </a>
              </div>
            </div>

            {/* DASHBOARD PREVIEW */}
            <div className="relative mx-auto mt-20 max-w-6xl"  data-aos="fade-up"
  data-aos-duration="1000">
              <div className="absolute -inset-10 rounded-[40px] bg-violet-500/[0.08] blur-3xl" />

              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0D0D14] shadow-2xl shadow-black/50">
                {/* browser top */}
                <div className="flex h-12 items-center border-b border-white/[0.06] px-4">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  </div>

                  <div className="mx-auto hidden rounded-lg border border-white/[0.06] bg-white/[0.02] px-16 py-1.5 text-[10px] text-gray-600 sm:block">
                    app.forbist.com/dashboard
                  </div>
                </div>

                <div className="grid min-h-[430px] grid-cols-1 lg:grid-cols-[210px_1fr]">
                  {/* fake sidebar */}
                  <aside className="hidden border-r border-white/[0.06] p-4 lg:block">
                    <div className="mb-8 flex items-center gap-2 px-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500">
                        <BarChart3 size={14} />
                      </div>
                      <span className="text-sm font-semibold">ForBist</span>
                    </div>

                    <div className="space-y-1">
                      {[
                        "Dashboard",
                        "Portföy",
                        "AI Asistan",
                        "Halka Arzlar",
                        "İşlemler",
                      ].map((item, index) => (
                        <div
                          key={item}
                          className={`rounded-lg px-3 py-2.5 text-xs ${
                            index === 0
                              ? "bg-violet-500/10 text-violet-300"
                              : "text-gray-600"
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </aside>

                  {/* fake dashboard */}
                  <div className="p-5 sm:p-7">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[11px] text-gray-500">
                          PORTFÖY GENEL DURUMU
                        </p>
                        <p className="mt-2 text-xl font-medium">
                          ₺248.420,50
                        </p>
                      </div>

                      <span className="text-xs text-emerald-400">
                        +%12,84
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
                      {[
                        ["Portföy Getiri", "₺28.420,50", "+%12,84"],
                        ["BIST 100", "11.245,30", "+%1,42"],
                        ["Gram Altın", "₺5.824,20", "+%0,74"],
                        ["Portföy Toplamı", "₺248.420", ""],
                      ].map(([title, value, change]) => (
                        <div
                          key={title}
                          className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4"
                        >
                          <p className="text-[10px] text-gray-600">{title}</p>
                          <p className="mt-2 text-sm font-medium">{value}</p>
                          {change && (
                            <p className="mt-1 text-[10px] text-emerald-400">
                              {change}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr]">
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-5">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-xs text-gray-500">
                              PORTFÖY DEĞERİ
                            </p>
                            <p className="mt-1 text-sm">Son 1 Yıl</p>
                          </div>

                          <div className="flex gap-1">
                            {["Hafta", "Ay", "Yıl"].map((item) => (
                              <span
                                key={item}
                                className={`rounded-md px-2 py-1 text-[9px] ${
                                  item === "Yıl"
                                    ? "bg-violet-500/20 text-violet-300"
                                    : "text-gray-600"
                                }`}
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="relative mt-8 h-36 overflow-hidden">
                          <div className="absolute inset-x-0 top-0 border-t border-white/[0.04]" />
                          <div className="absolute inset-x-0 top-1/2 border-t border-white/[0.04]" />
                          <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.04]" />

                          <svg
                            viewBox="0 0 700 160"
                            className="absolute inset-0 h-full w-full"
                            preserveAspectRatio="none"
                          >
                            <defs>
                              <linearGradient
                                id="chartGradient"
                                x1="0"
                                x2="0"
                                y1="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="#8B5CF6"
                                  stopOpacity="0.25"
                                />
                                <stop
                                  offset="100%"
                                  stopColor="#8B5CF6"
                                  stopOpacity="0"
                                />
                              </linearGradient>
                            </defs>

                            <path
                              d="M0 130 C60 120 80 125 130 105 C180 85 190 110 240 92 C300 70 320 88 370 65 C430 40 450 75 500 55 C560 35 600 50 700 18 L700 160 L0 160 Z"
                              fill="url(#chartGradient)"
                            />

                            <path
                              d="M0 130 C60 120 80 125 130 105 C180 85 190 110 240 92 C300 70 320 88 370 65 C430 40 450 75 500 55 C560 35 600 50 700 18"
                              fill="none"
                              stroke="#8B5CF6"
                              strokeWidth="2"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-5">
                        <p className="text-xs text-gray-500">
                          PORTFÖY DAĞILIMI
                        </p>

                        <div className="mt-6 flex items-center justify-center">
                          <div className="relative h-32 w-32 rounded-full border-[20px] border-violet-500">
                            <div className="absolute -right-5 top-0 h-full w-20 -rotate-45 rounded-full border-[20px] border-indigo-400 border-l-transparent border-b-transparent" />

                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <p className="text-xs font-medium">8</p>
                                <p className="text-[9px] text-gray-600">
                                  Hisse
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="border-y border-white/[0.06] bg-white/[0.015]"  data-aos="fade-right"
  data-aos-duration="800">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-white/[0.06] sm:grid-cols-4">
            {stats.map(([top, bottom]) => (
              <div key={top} className="px-5 py-8 text-center">
                <p className="text-lg font-semibold">{top}</p>
                <p className="mt-1 text-xs text-gray-500">{bottom}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="ozellikler" className="px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-400">
                ForBist
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                Portföyünün tamamını
                <span className="block text-gray-500">
                  daha net gör.
                </span>
              </h2>

              <p className="mt-5 text-sm leading-7 text-gray-500 sm:text-base">
                Yatırım araçlarını farklı uygulamalarda takip etmek yerine
                ihtiyacın olan temel bilgileri tek bir yerde topla.
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-2"  data-aos="fade-up"
  data-aos-duration="800">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 transition duration-300 hover:border-violet-500/20 hover:bg-violet-500/[0.03]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                        <Icon size={20} />
                      </div>

                      <span className="text-xs text-gray-700">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="mt-7 text-lg font-medium">
                      {feature.title}
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
                      {feature.description}
                    </p>

                    <div className="mt-6 flex items-center gap-1 text-xs text-gray-600 transition group-hover:text-violet-400">
                      Daha fazla
                      <ChevronRight size={14} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* AI */}
        <section
          id="ai"
          className="relative overflow-hidden border-y border-white/[0.06] px-5 py-24 sm:px-8 lg:py-32"
        >
          <div className="absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-violet-500/[0.08] blur-[120px]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Brain size={21} />
              </div>

              <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-5xl">
                Portföyünü
                <span className="block text-violet-400">
                  AI ile analiz et.
                </span>
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-gray-500 sm:text-base">
                ForBist AI Asistan ile portföyündeki hisseler hakkında
                sorular sor, riskleri ve fırsatları daha hızlı değerlendir.
              </p>

              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white transition hover:bg-white/[0.08]"
              >
                AI Asistanı Keşfet
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-[#0D0D14] p-5 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  <Brain size={17} />
                </div>

                <div>
                  <p className="text-sm font-medium">ForBist AI</p>
                  <p className="text-[10px] text-gray-600">
                    Portföy asistanın
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="ml-auto max-w-[80%] rounded-xl rounded-br-sm bg-violet-500/10 p-3"  data-aos="fade-left"
  data-aos-duration="800">
                  <p className="text-xs leading-5 text-gray-300">
                    Portföyümde riskli hisseler hangileri?
                  </p>
                </div>

                <div data-aos="fade-right"
  data-aos-duration="800" className="max-w-[90%] rounded-xl rounded-bl-sm border border-white/[0.06] bg-white/[0.025] p-4">
                  <p className="text-xs leading-5 text-gray-400">
                    Portföyündeki hisseleri volatilite, ağırlık ve performans
                    açısından değerlendirdiğimde <span className="text-white">3 hisse</span>{" "}
                    diğerlerine göre daha yüksek risk taşıyor.
                  </p>

                  <div className="mt-4 space-y-2">
                    {[
                      ["FROTO", "Yüksek", "+%8,42"],
                      ["ASELS", "Orta", "+%5,21"],
                      ["THYAO", "Düşük", "+%2,84"],
                    ].map(([name, risk, change]) => (
                      <div
                        key={name}
                        className="flex items-center justify-between rounded-lg bg-white/[0.025] px-3 py-2.5"
                      >
                        <span className="text-xs font-medium">{name}</span>
                        <span className="text-[10px] text-gray-500">
                          {risk}
                        </span>
                        <span className="text-[10px] text-emerald-400">
                          {change}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECURITY */}
        <section id="nasil" className="px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 sm:p-12 lg:flex lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck size={21} />
                </div>

                <h2 className="mt-6 text-2xl font-semibold sm:text-4xl">
                  Yatırımlarını değil,
                  <span className="text-gray-500"> verilerini yönet.</span>
                </h2>

                <p className="mt-4 text-sm leading-7 text-gray-500">
                  ForBist, portföy verilerini düzenli ve kontrollü şekilde
                  takip edebilmen için tasarlandı.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-0">
                {["Güvenli Auth", "HttpOnly Cookie", "Input Validation"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-4 text-center text-xs text-gray-400"
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

       
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500">
              <BarChart3 size={14} />
            </div>

            <span className="text-sm font-medium">ForBist</span>
          </div>

          <p className="text-xs text-gray-600">
            © 2026 ForBist. Tüm hakları saklıdır.
          </p>

          <div className="flex gap-5 text-xs text-gray-600">
            <Link to="/login" className="transition hover:text-white">
              Giriş
            </Link>
            <Link to="/register" className="transition hover:text-white">
              Kayıt Ol
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}