import { useEffect, useState } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Save,
  Lock,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [notifications, setNotifications] = useState(true);
  const [marketAlerts, setMarketAlerts] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/me",
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Hesap bilgileri alınamadı.");
        }

        const result = await response.json();

        setName(result.user?.name || "");
        setEmail(result.user?.email || "");
      } catch (error) {
        console.error("Settings yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

const handleSave = async () => {
  setSaving(true);
  setMessage("");

  try {
    const response = await fetch(
      "http://localhost:3000/api/auth/profile",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          notifications,
          marketAlerts,
        }),
      }
    );

    const text = await response.text();

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      console.error("Backend JSON yerine şunu döndürdü:", text);

      throw new Error(
        `Sunucu geçersiz cevap döndürdü. HTTP ${response.status}`
      );
    }

    if (!response.ok) {
      throw new Error(
        result.message || "Değişiklikler kaydedilemedi."
      );
    }

    setMessage("Değişiklikler kaydedildi.");
  } catch (error) {
    console.error("Settings kayıt hatası:", error);
    setMessage(error.message);
  } finally {
    setSaving(false);
  }
};


const handlePasswordReset = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/auth/request-password-reset",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "İşlem başarısız."
      );
    }

    setMessage(
      "Şifre değiştirme bağlantısı e-posta adresine gönderildi."
    );
  } catch (error) {
    console.error("Password reset error:", error);
    setMessage(error.message);
  }
};
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0A0A0F] text-white">
      <Sidebar />

      <div className="ml-0 md:ml-64">
        <Header />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
              Ayarlar
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Hesabını ve ForBist tercihlerini yönet.
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-5">

            {/* Profil */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.025]">
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                  <User size={17} />
                </div>

                <div>
                  <h2 className="text-sm font-medium text-gray-200">
                    Profil
                  </h2>

                  <p className="text-xs text-gray-500">
                    Hesap bilgilerini düzenle.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    Ad Soyad
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-200 outline-none transition focus:border-violet-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-500">
                    E-posta
                  </label>

                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-gray-500 outline-none"
                  />

                  <p className="mt-2 text-xs text-gray-600">
                    E-posta adresi değiştirilemez.
                  </p>
                </div>
              </div>
            </section>

            {/* Bildirimler */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.025]">
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                  <Bell size={17} />
                </div>

                <div>
                  <h2 className="text-sm font-medium text-gray-200">
                    Bildirimler
                  </h2>

                  <p className="text-xs text-gray-500">
                    Bildirim tercihlerini yönet.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-white/5">
                <SettingRow
                  title="Bildirimler"
                  description="ForBist bildirimlerini al."
                  enabled={notifications}
                  onChange={() =>
                    setNotifications(!notifications)
                  }
                />

                <SettingRow
                  title="Piyasa uyarıları"
                  description="Önemli fiyat hareketleri hakkında bildirim al."
                  enabled={marketAlerts}
                  onChange={() =>
                    setMarketAlerts(!marketAlerts)
                  }
                />
              </div>
            </section>

            {/* Görünüm */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.025]">
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                  <Palette size={17} />
                </div>

                <div>
                  <h2 className="text-sm font-medium text-gray-200">
                    Görünüm
                  </h2>

                  <p className="text-xs text-gray-500">
                    Uygulamanın görünümünü özelleştir.
                  </p>
                </div>
              </div>

              <div className="p-5">
                <p className="mb-3 text-xs text-gray-500">
                  Tema
                </p>

                <div className="grid grid-cols-2 gap-3 sm:max-w-md">
                  <button className="rounded-xl border border-violet-500/40 bg-violet-500/10 px-4 py-3 text-sm text-violet-300">
                    Koyu
                  </button>

                  <div className="group relative">
                    <button
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-gray-600"
                    >
                      Açık
                    </button>

                    <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-[#15151C] px-3 py-2 text-xs text-gray-400 opacity-0 shadow-xl transition group-hover:opacity-100">
                      Henüz oluşturulmadı
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Güvenlik */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.025]">
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                  <Shield size={17} />
                </div>

                <div>
                  <h2 className="text-sm font-medium text-gray-200">
                    Güvenlik
                  </h2>

                  <p className="text-xs text-gray-500">
                    Hesap güvenliği.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="text-sm text-gray-200">
                    Şifre
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Hesap şifreni değiştirmek için kullan.
                  </p>
                </div>

                <button
  onClick={handlePasswordReset}
  className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/[0.06] hover:text-white"
>
  <Lock size={15} />
  Şifreyi Değiştir
</button>
              </div>
            </section>

            {/* Save */}
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-gray-400">
                {message}
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={16} />

                {saving
                  ? "Kaydediliyor..."
                  : "Değişiklikleri Kaydet"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SettingRow({
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div>
        <p className="text-sm text-gray-200">
          {title}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>
      </div>

      <button
        onClick={onChange}
        aria-label={`${title} ${enabled ? "kapat" : "aç"}`}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-violet-500"
            : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}