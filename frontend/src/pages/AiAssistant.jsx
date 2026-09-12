import { useState } from "react";
import { Send, Sparkles, Bot, User } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AiAssistant() {
  const [message, setMessage] = useState("");

  const suggestions = [
    "Portföyümün durumunu analiz et",
    "Bugün BIST'te neler oldu?",
    "Portföyümde riskli hisseler hangileri?",
    "FROTO hakkında kısa analiz yap",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    console.log("Kullanıcı:", message);
    setMessage("");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0A0A0F] text-white">
      <Sidebar />

      <div className="ml-0 md:ml-64">
        <Header />

        <main className="flex min-h-[calc(100vh-73px)] flex-col p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mx-auto w-full max-w-5xl">
            <div className="mb-6">
              <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
                AI Asistan
              </h1>

              <p className="mt-2 text-sm text-gray-400">
                Portföyün ve piyasalar hakkında sorularını sor.
              </p>
            </div>

            {/* Chat */}
            <div className="flex min-h-[620px] flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
              {/* Assistant Header */}
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                  <Sparkles size={19} />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-200">
                    ForBist AI
                  </p>

                  <p className="text-xs text-gray-500">
                    Finansal analiz asistanı
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex max-w-2xl items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                    <Bot size={16} />
                  </div>

                  <div className="rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.035] px-4 py-3">
                    <p className="text-sm leading-6 text-gray-300">
                      Merhaba Yağız. Portföyün, BIST hisseleri veya piyasa
                      hakkında ne öğrenmek istiyorsun?
                    </p>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="mt-auto pt-8">
                  <p className="mb-3 text-xs text-gray-500">
                    Örnek sorular
                  </p>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setMessage(suggestion)}
                        className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left text-sm text-gray-400 transition hover:border-violet-500/30 hover:bg-violet-500/[0.04] hover:text-gray-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-white/10 p-4">
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-2 focus-within:border-violet-500/40"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center text-gray-500">
                    <User size={17} />
                  </div>

                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Portföyün hakkında bir şey sor..."
                    className="min-w-0 flex-1 bg-transparent px-1 text-sm text-gray-200 outline-none placeholder:text-gray-600"
                  />

                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500 text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}