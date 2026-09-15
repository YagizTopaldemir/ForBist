import { useState } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AiAssistant() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "Portföyümün durumunu analiz et",
    "Bugün BIST'te neler oldu?",
    "Portföyümde riskli hisseler hangileri?",
    "FROTO hakkında kısa analiz yap",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage || loading) return;

    const userMessage = {
      role: "user",
      content: cleanMessage,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/ai/chat",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: cleanMessage,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "AI isteği gerçekleştirilemedi."
        );
      }

      const aiMessage =
        result.data?.message ||
        result.message ||
        "AI'dan cevap alınamadı.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiMessage,
        },
      ]);
    } catch (error) {
      console.error("AI chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error.message ||
            "AI ile bağlantı kurulamadı.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion) => {
    setMessage(suggestion);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0A0A0F] text-white">
      <Sidebar />

      <div className="ml-0 md:ml-64">
        <Header />

        <main className="flex min-h-[calc(100vh-73px)] flex-col p-4 sm:p-6 lg:p-8">
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">

            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
                AI Asistan
              </h1>

              <p className="mt-2 text-sm text-gray-400">
                Portföyün ve piyasalar hakkında
                sorularını sor.
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
              <div className="flex flex-1 flex-col overflow-y-auto p-5">

                {/* Initial Message */}
                {messages.length === 0 && (
                  <>
                    <div className="flex max-w-2xl items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                        <Bot size={16} />
                      </div>

                      <div className="rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.035] px-4 py-3">
                        <p className="text-sm leading-6 text-gray-300">
                          Merhaba Yağız. Portföyün,
                          BIST hisseleri veya piyasa
                          hakkında ne öğrenmek
                          istiyorsun?
                        </p>
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="mt-auto pt-8">
                      <p className="mb-3 text-xs text-gray-500">
                        Örnek sorular
                      </p>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {suggestions.map(
                          (suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() =>
                                handleSuggestion(
                                  suggestion
                                )
                              }
                              className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left text-sm text-gray-400 transition hover:border-violet-500/30 hover:bg-violet-500/[0.04] hover:text-gray-200"
                            >
                              {suggestion}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Chat Messages */}
                {messages.length > 0 && (
                  <div className="space-y-6">
                    {messages.map(
                      (msg, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-3 ${
                            msg.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {msg.role ===
                            "assistant" && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                              <Bot size={16} />
                            </div>
                          )}

                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                              msg.role === "user"
                                ? "rounded-tr-md bg-violet-500 text-white"
                                : msg.error
                                ? "rounded-tl-md border border-red-500/20 bg-red-500/10 text-red-400"
                                : "rounded-tl-md border border-white/10 bg-white/[0.035] text-gray-300"
                            }`}
                          >
                            <div className="whitespace-pre-line text-sm leading-7">
                              {msg.content}
                            </div>
                          </div>

                          {msg.role ===
                            "user" && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-gray-400">
                              <User size={16} />
                            </div>
                          )}
                        </div>
                      )
                    )}

                    {/* Loading */}
                    {loading && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                          <Bot size={16} />
                        </div>

                        <div className="rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.035] px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-500" />
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-500 [animation-delay:150ms]" />
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-500 [animation-delay:300ms]" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                    onChange={(e) =>
                      setMessage(e.target.value)
                    }
                    placeholder="Portföyün hakkında bir şey sor..."
                    disabled={loading}
                    maxLength={2000}
                    className="min-w-0 flex-1 bg-transparent px-1 text-sm text-gray-200 outline-none placeholder:text-gray-600 disabled:opacity-50"
                  />

                  <button
                    type="submit"
                    disabled={
                      !message.trim() || loading
                    }
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