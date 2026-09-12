import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  TrendingUp,
  Plus,
  MoreHorizontal,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);

  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  // BUY / SELL
  const [transactionType, setTransactionType] = useState("BUY");

  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  const loadPortfolio = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/portfolio",
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Portföy alınamadı.");
      }

      const result = await response.json();

      setPortfolio(result.data.holdings);
      setSummary(result.data);
    } catch (error) {
      console.error("Portfolio error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const profitLoss = Number(summary?.profitLoss || 0);

  const profitLossPercent = Number(
    summary?.profitLossPercent || 0
  );

  const resetForm = () => {
    setSymbol("");
    setQuantity("");
    setPrice("");
    setTransactionType("BUY");
    setAddError("");
  };

  const closeModal = () => {
    if (adding) return;

    resetForm();
    setShowAddModal(false);
  };

  const handleTransaction = async () => {
    setAddError("");

    const cleanSymbol = symbol.trim().toUpperCase();
    const numericQuantity = Number(quantity);
    const numericPrice = Number(price);

    if (!cleanSymbol || !quantity || !price) {
      setAddError("Tüm alanları doldur.");
      return;
    }

    if (!/^[A-Z0-9]{1,10}$/.test(cleanSymbol)) {
      setAddError("Geçerli bir hisse kodu gir.");
      return;
    }

    if (numericQuantity <= 0) {
      setAddError("Adet 0'dan büyük olmalı.");
      return;
    }

    if (numericPrice <= 0) {
      setAddError("Fiyat 0'dan büyük olmalı.");
      return;
    }

    try {
      setAdding(true);

      const response = await fetch(
        "http://localhost:3000/api/transactions",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            symbol: cleanSymbol,
            type: transactionType,
            quantity: numericQuantity,
            price: numericPrice,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "İşlem gerçekleştirilemedi."
        );
      }

      await loadPortfolio();

      closeModal();
    } catch (error) {
      console.error("Transaction error:", error);

      setAddError(
        error.message || "İşlem gerçekleştirilemedi."
      );
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0A0A0F] text-white">
      <Sidebar />

      <div className="ml-0 md:ml-64">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8">

          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
                Portföy
              </h1>

              <p className="mt-2 text-sm text-gray-400">
                Yatırımlarını ve performansını takip et.
              </p>
            </div>

            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-medium transition hover:bg-violet-400 sm:w-fit"
            >
              <Plus size={17} />
              Varlık Ekle
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Total Portfolio */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-gray-500">
                Toplam Portföy
              </p>

              <h2 className="mt-3 text-2xl font-normal text-gray-100">
                ₺
                {Number(summary?.totalValue || 0).toLocaleString(
                  "tr-TR",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {portfolio.length} farklı varlık
              </p>
            </div>

            {/* Profit / Loss */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-gray-500">
                Toplam Kâr / Zarar
              </p>

              <h2
                className={`mt-3 text-2xl font-normal ${
                  profitLoss >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {profitLoss >= 0 ? "+" : "-"}₺
                {Math.abs(profitLoss).toLocaleString(
                  "tr-TR",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </h2>

              <p
                className={`mt-2 flex items-center gap-1 text-sm ${
                  profitLoss >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                <TrendingUp size={15} />

                {profitLossPercent >= 0 ? "+" : "-"}%
                {Math.abs(profitLossPercent).toFixed(2)}
              </p>
            </div>

            {/* Daily Change */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-gray-500">
                Günlük Değişim
              </p>

              <h2 className="mt-3 text-2xl font-normal text-gray-500">
                —
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Yakında
              </p>
            </div>

            {/* Total Cost */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-gray-500">
                Yatırım Maliyeti
              </p>

              <h2 className="mt-3 text-2xl font-normal text-gray-100">
                ₺
                {Number(summary?.totalCost || 0).toLocaleString(
                  "tr-TR",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Toplam alış maliyeti
              </p>
            </div>
          </div>

          {/* Assets */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03]">

            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <h2 className="text-base font-medium">
                  Varlıklarım
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Portföyündeki yatırım araçları
                </p>
              </div>

              <button className="rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-white">
                <MoreHorizontal size={19} />
              </button>
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">

                <thead>
                  <tr className="border-b border-white/10 text-left text-xs text-gray-500">
                    <th className="px-5 py-4 font-normal">
                      Varlık
                    </th>

                    <th className="px-5 py-4 font-normal">
                      Adet
                    </th>

                    <th className="px-5 py-4 font-normal">
                      Ortalama
                    </th>

                    <th className="px-5 py-4 font-normal">
                      Güncel Fiyat
                    </th>

                    <th className="px-5 py-4 font-normal">
                      Değer
                    </th>

                    <th className="px-5 py-4 text-right font-normal">
                      Kâr / Zarar
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-5 py-10 text-center text-sm text-gray-500"
                      >
                        Portföy yükleniyor...
                      </td>
                    </tr>
                  ) : portfolio.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-5 py-10 text-center text-sm text-gray-500"
                      >
                        Henüz portföyünde varlık bulunmuyor.
                      </td>
                    </tr>
                  ) : (
                    portfolio.map((asset) => (
                      <tr
                        key={asset.id}
                        className="border-b border-white/5 transition hover:bg-white/[0.025]"
                      >
                        <td className="px-5 py-5">
                          <p className="font-medium text-gray-200">
                            {asset.symbol}
                          </p>
                        </td>

                        <td className="px-5 py-5 text-sm text-gray-300">
                          {Number(asset.quantity).toLocaleString(
                            "tr-TR"
                          )}
                        </td>

                        <td className="px-5 py-5 text-sm text-gray-400">
                          ₺
                          {Number(
                            asset.averagePrice
                          ).toLocaleString("tr-TR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>

                        <td className="px-5 py-5 text-sm text-gray-200">
                          ₺
                          {Number(
                            asset.currentPrice
                          ).toLocaleString("tr-TR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>

                        <td className="px-5 py-5 text-sm text-gray-200">
                          ₺
                          {Number(
                            asset.value
                          ).toLocaleString("tr-TR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>

                        <td className="px-5 py-5 text-right">
                          <p
                            className={
                              Number(asset.profitLoss) >= 0
                                ? "text-sm text-emerald-400"
                                : "text-sm text-red-400"
                            }
                          >
                            {Number(asset.profitLoss) >= 0
                              ? "+"
                              : "-"}
                            ₺
                            {Math.abs(
                              Number(asset.profitLoss)
                            ).toLocaleString("tr-TR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>

                          <p
                            className={
                              Number(asset.profitLoss) >= 0
                                ? "mt-1 text-xs text-emerald-500"
                                : "mt-1 text-xs text-red-500"
                            }
                          >
                            {Number(asset.profitLoss) >= 0
                              ? "+"
                              : "-"}
                            %
                            {Math.abs(
                              Number(
                                asset.profitLossPercent
                              )
                            ).toFixed(2)}
                          </p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>
          </div>

          {/* Add / Sell Modal */}
          {showAddModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                  closeModal();
                }
              }}
            >
              <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111118] p-6 shadow-2xl">

                {/* Modal Header */}
                <div className="mb-6 flex items-start justify-between">

                  <div>
                    <h2 className="text-lg font-medium text-white">
                      {transactionType === "BUY"
                        ? "Varlık Al"
                        : "Varlık Sat"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Portföy işlemini gerçekleştir.
                    </p>
                  </div>

                  <button
                    onClick={closeModal}
                    disabled={adding}
                    className="rounded-lg p-1 text-gray-500 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                  >
                    <X size={19} />
                  </button>
                </div>

                <div className="space-y-4">

                  {/* BUY / SELL */}
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-white/[0.03] p-1">

                    <button
                      type="button"
                      onClick={() => {
                        setTransactionType("BUY");
                        setAddError("");
                      }}
                      className={`rounded-lg py-2.5 text-sm font-medium transition ${
                        transactionType === "BUY"
                          ? "bg-emerald-500 text-white"
                          : "text-gray-500 hover:text-white"
                      }`}
                    >
                      Al
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTransactionType("SELL");
                        setAddError("");
                      }}
                      className={`rounded-lg py-2.5 text-sm font-medium transition ${
                        transactionType === "SELL"
                          ? "bg-red-500 text-white"
                          : "text-gray-500 hover:text-white"
                      }`}
                    >
                      Sat
                    </button>

                  </div>

                  {/* Symbol */}
                  <div>
                    <label className="mb-2 block text-sm text-gray-400">
                      Hisse kodu
                    </label>

                    <input
                      type="text"
                      value={symbol}
                      onChange={(e) =>
                        setSymbol(
                          e.target.value.toUpperCase()
                        )
                      }
                      placeholder="Örn. THYAO"
                      maxLength={10}
                      autoFocus
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm uppercase text-white outline-none placeholder:text-gray-600 focus:border-violet-500"
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="mb-2 block text-sm text-gray-400">
                      Adet
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(e.target.value)
                      }
                      placeholder="Örn. 10"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-violet-500"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="mb-2 block text-sm text-gray-400">
                      {transactionType === "BUY"
                        ? "Alış fiyatı"
                        : "Satış fiyatı"}
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) =>
                        setPrice(e.target.value)
                      }
                      placeholder="Örn. 285.50"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-violet-500"
                    />
                  </div>

                  {/* Error */}
                  {addError && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                      <p className="text-sm text-red-400">
                        {addError}
                      </p>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    disabled={adding}
                    onClick={handleTransaction}
                    className={`w-full rounded-xl py-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      transactionType === "BUY"
                        ? "bg-emerald-500 hover:bg-emerald-400"
                        : "bg-red-500 hover:bg-red-400"
                    }`}
                  >
                    {adding
                      ? "İşleniyor..."
                      : transactionType === "BUY"
                      ? "Portföye Ekle"
                      : "Satışı Gerçekleştir"}
                  </button>

                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}