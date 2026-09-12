import { Search, Bell, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) return;

    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(
        `${query} hissesi`
      )}`,
      "_blank",
      "noopener,noreferrer"
    );

    setSearch("");
  };

  const handleNotification = () => {
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <>
      {/* Notification */}
      {showNotification && (
        <div className="fixed right-5 top-5 z-[100] w-[320px] rounded-2xl border border-white/10 bg-[#111118] p-4 shadow-2xl shadow-black/40">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
              <Bell size={17} className="text-violet-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-white">
                Bildirimler
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Bildirim sistemi şu anda kullanılamıyor.
              </p>
            </div>
          </div>
        </div>
      )}

      <header className="flex h-20 items-center justify-end border-b border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="hidden items-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 sm:flex"
          >
            <Search size={17} className="text-gray-500" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Hisse ara..."
              className="ml-2 w-32 bg-transparent text-sm text-white outline-none placeholder:text-gray-500 lg:w-40"
            />
          </form>

          {/* Mobile Search */}
          <button
            onClick={() => {
              const query = window.prompt("Hisse ara:");

              if (query?.trim()) {
                window.open(
                  `https://www.google.com/search?q=${encodeURIComponent(
                    `${query.trim()} hissesi`
                  )}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }
            }}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-gray-400 transition hover:bg-white/10 hover:text-white sm:hidden"
          >
            <Search size={18} />
          </button>

          {/* Notifications */}
          <button
            onClick={handleNotification}
            className="relative rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
            title="Bildirimler"
          >
            <Bell size={18} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-400" />
          </button>

          {/* Avatar */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] text-sm font-medium text-white">
            Y
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
            title="Çıkış Yap"
          >
            <LogOut size={18} />
          </button>

        </div>
      </header>
    </>
  );
}