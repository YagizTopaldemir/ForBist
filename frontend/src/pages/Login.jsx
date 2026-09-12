import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Email ve şifre gerekli.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email.trim().toLowerCase(),
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Giriş yapılamadı.");
        return;
      }

      // Backend HttpOnly cookie oluşturdu.
      // Kullanıcı artık authenticated.
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07070B] px-4 text-white">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-220px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#8B5CF6]/10 blur-[130px]" />

        <div className="absolute bottom-[-250px] left-[-150px] h-[400px] w-[400px] rounded-full bg-[#6366F1]/5 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">

        {/* Brand */}
        <div className="mb-9 text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-[42px] font-black leading-none tracking-[0.18em]">
              FORBIST
            </h1>
          </Link>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-white/10" />

            <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
              Portfolio Intelligence
            </span>

            <span className="h-px w-8 bg-white/10" />
          </div>
        </div>

        {/* Card */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-[#111116]/90 p-7 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">

          <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#8B5CF6]/70 to-transparent" />

          <div className="mb-7">
            <h2 className="text-xl font-semibold">
              Hoş geldiniz
            </h2>

            <p className="mt-1.5 text-sm text-gray-500">
              ForBist hesabınıza giriş yapın.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-medium text-gray-400"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  maxLength={255}
                  autoComplete="email"
                  required
                  placeholder="ornek@email.com"
                  className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#0A0A0F] pl-11 pr-4 text-sm text-white placeholder:text-gray-700 outline-none transition focus:border-[#8B5CF6]/60 focus:bg-[#0C0C12] focus:ring-2 focus:ring-[#8B5CF6]/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-medium text-gray-400"
              >
                Şifre
              </label>

              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"
                />

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  maxLength={128}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#0A0A0F] pl-11 pr-4 text-sm text-white placeholder:text-gray-700 outline-none transition focus:border-[#8B5CF6]/60 focus:bg-[#0C0C12] focus:ring-2 focus:ring-[#8B5CF6]/10"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-sm font-semibold text-white shadow-[0_8px_30px_rgba(139,92,246,0.18)] transition hover:scale-[1.01] hover:shadow-[0_10px_35px_rgba(139,92,246,0.28)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                "Giriş yapılıyor..."
              ) : (
                <>
                  Giriş Yap
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </form>

          {/* Register */}
          <div className="mt-7 border-t border-white/[0.06] pt-6 text-center text-sm">
            <span className="text-gray-500">
              Henüz hesabınız yok mu?
            </span>{" "}

            <Link
              to="/register"
              className="font-medium text-[#A78BFA] transition hover:text-white"
            >
              Hesap oluştur
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] tracking-wide text-gray-700">
          Güvenli bağlantı · ForBist
        </p>
      </div>
    </main>
  );
}