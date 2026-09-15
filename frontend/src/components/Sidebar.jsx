import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Bot,
  Building2,
  Newspaper,
  ArrowLeftRight,
  Settings,
  Menu,
  X,
} from "lucide-react";
import logo from "../img/logo.png";


const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Portföy",
    path: "/portfolio",
    icon: Briefcase,
  },
  {
    name: "AI Asistan",
    path: "/ai-assistant",
    icon: Bot,
  },
  {
    name: "Halka Arzlar",
    path: "/ipo",
    icon: Building2,
  },
  {
    name: "Haberler",
    path: "/news",
    icon: Newspaper,
  },
  {
    name: "İşlemler",
    path: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    name: "Ayarlar",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-xl border border-white/10 bg-[#111118] p-2.5 text-gray-300 transition hover:bg-white/10 md:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-white/10 bg-[#0A0A0F] px-5 py-6 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA]">
              <span className="text-lg font-extrabold">F</span>
            </div>

            <div>
              <h2 className="text-lg font-medium">
                ForBist
              </h2>

              <p className="text-xs text-gray-500">
                Portfolio Intelligence
              </p>
            </div>
          </div>

          {/* Mobile Close */}
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                    isActive
                      ? "bg-violet-500/10 text-violet-300"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-5">
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
            <p className="text-xs text-gray-500">
              ForBist
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Borsa takip sistemi
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}