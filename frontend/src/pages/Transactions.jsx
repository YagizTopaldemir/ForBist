import { useEffect, useMemo, useState } from "react";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/transactions",
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("İşlemler alınamadı.");
        }

        const result = await response.json();

        console.log("Transactions API:", result);

        setTransactions(result.data || []);
      } catch (error) {
        console.error("İşlem hatası:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return transactions;
    }

    return transactions.filter(
      (transaction) =>
        transaction.symbol?.toLowerCase().includes(query) ||
        transaction.name?.toLowerCase().includes(query)
    );
  }, [transactions, search]);

  const totalBuy = transactions
    .filter((transaction) => transaction.type === "BUY")
    .reduce(
      (total, transaction) =>
        total +
        Number(transaction.quantity) * Number(transaction.price),
      0
    );

  const totalSell = transactions
    .filter((transaction) => transaction.type === "SELL")
    .reduce(
      (total, transaction) =>
        total +
        Number(transaction.quantity) * Number(transaction.price),
      0
    );

  const formatMoney = (value) =>
    Number(value).toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0A0A0F] text-white">
      <Sidebar />

      <div className="ml-0 md:ml-64">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
              İşlemler
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Alım ve satım işlemlerini takip et.
            </p>
          </div>

          {/* Summary */}
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <p className="text-sm text-gray-500">
                Toplam İşlem
              </p>

              <p className="mt-2 text-2xl font-medium">
                {transactions.length}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <p className="text-sm text-gray-500">
                Toplam Alım
              </p>

              <p className="mt-2 text-2xl font-medium text-emerald-400">
                ₺{formatMoney(totalBuy)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <p className="text-sm text-gray-500">
                Toplam Satış
              </p>

              <p className="mt-2 text-2xl font-medium text-red-400">
                ₺{formatMoney(totalSell)}
              </p>
            </div>
          </div>

          {/* Transactions */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-xs">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Hisse ara..."
                  className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-10 pr-4 text-sm text-gray-200 outline-none placeholder:text-gray-600 focus:border-violet-500/40"
                />
              </div>

              <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-gray-400 transition hover:bg-white/[0.06] hover:text-white">
                <SlidersHorizontal size={16} />
                Filtrele
              </button>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-violet-400" />
                  İşlemler yükleniyor...
                </div>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <p className="text-sm text-gray-500">
                  {search
                    ? "Aramanızla eşleşen işlem bulunamadı."
                    : "Henüz işlem bulunmuyor."}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 text-left text-xs text-gray-500">
                        <th className="px-5 py-4 font-normal">
                          İşlem
                        </th>
                        <th className="px-5 py-4 font-normal">
                          Hisse
                        </th>
                        <th className="px-5 py-4 font-normal">
                          Miktar
                        </th>
                        <th className="px-5 py-4 font-normal">
                          Fiyat
                        </th>
                        <th className="px-5 py-4 font-normal">
                          Toplam
                        </th>
                        <th className="px-5 py-4 font-normal">
                          Tarih
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/5">
                      {filteredTransactions.map(
                        (transaction) => {
                          const isBuy =
                            transaction.type === "BUY";

                          const total =
                            Number(transaction.quantity) *
                            Number(transaction.price);

                          return (
                            <tr
                              key={transaction.id}
                              className="transition hover:bg-white/[0.025]"
                            >
                              <td className="px-5 py-4">
                                <div
                                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                    isBuy
                                      ? "bg-emerald-500/10 text-emerald-400"
                                      : "bg-red-500/10 text-red-400"
                                  }`}
                                >
                                  {isBuy ? (
                                    <ArrowDownLeft size={17} />
                                  ) : (
                                    <ArrowUpRight size={17} />
                                  )}
                                </div>
                              </td>

                              <td className="px-5 py-4">
                                <p className="text-sm font-medium text-gray-200">
                                  {transaction.symbol}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  {transaction.name ||
                                    transaction.symbol}
                                </p>
                              </td>

                              <td className="px-5 py-4 text-sm text-gray-300">
                                {Number(
                                  transaction.quantity
                                ).toLocaleString(
                                  "tr-TR"
                                )}{" "}
                                adet
                              </td>

                              <td className="px-5 py-4 text-sm text-gray-300">
                                ₺
                                {formatMoney(
                                  transaction.price
                                )}
                              </td>

                              <td className="px-5 py-4 text-sm font-medium text-gray-200">
                                ₺{formatMoney(total)}
                              </td>

                              <td className="px-5 py-4 text-sm text-gray-500">
                                {formatDate(
                                  transaction.transaction_date
                                )}
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="divide-y divide-white/5 md:hidden">
                  {filteredTransactions.map(
                    (transaction) => {
                      const isBuy =
                        transaction.type === "BUY";

                      const total =
                        Number(transaction.quantity) *
                        Number(transaction.price);

                      return (
                        <div
                          key={transaction.id}
                          className="p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                  isBuy
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-red-500/10 text-red-400"
                                }`}
                              >
                                {isBuy ? (
                                  <ArrowDownLeft size={17} />
                                ) : (
                                  <ArrowUpRight size={17} />
                                )}
                              </div>

                              <div>
                                <p className="text-sm font-medium">
                                  {transaction.symbol}
                                </p>

                                <p className="text-xs text-gray-500">
                                  {formatDate(
                                    transaction.transaction_date
                                  )}
                                </p>
                              </div>
                            </div>

                            <p className="text-sm font-medium text-gray-200">
                              ₺{formatMoney(total)}
                            </p>
                          </div>

                          <div className="mt-4 flex justify-between text-xs text-gray-500">
                            <span>
                              {Number(
                                transaction.quantity
                              ).toLocaleString(
                                "tr-TR"
                              )}{" "}
                              adet
                            </span>

                            <span>
                              ₺
                              {formatMoney(
                                transaction.price
                              )}
                            </span>

                            <span
                              className={
                                isBuy
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }
                            >
                              {isBuy
                                ? "Alış"
                                : "Satış"}
                            </span>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}