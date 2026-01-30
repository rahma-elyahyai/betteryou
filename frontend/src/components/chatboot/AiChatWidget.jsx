import React, { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import { sendAiMessage } from "@/api/aiChatApi";

// Noir + jaune (comme ton style)
const ACCENT = "#D6F93D";

export default function AiChatWidget({ userId }) {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState([]);


  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  // Reset automatique à chaque nouvel utilisateur
useEffect(() => {
  if (!userId) return;

  // Reset local state
  setConversationId("");
  setMessages([]);

  // Reset localStorage
  localStorage.removeItem("ai_conversation_id");
  localStorage.removeItem("ai_messages");
}, [userId]);


  // Persist local state (simple) so refresh keeps chat
  useEffect(() => {
    localStorage.setItem("ai_conversation_id", conversationId || "");
  }, [conversationId]);

  useEffect(() => {
    localStorage.setItem("ai_messages", JSON.stringify(messages));
  }, [messages]);

  // Auto scroll bottom
  useEffect(() => {
    if (!open) return;
    setTimeout(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, [messages, open]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function onSend() {
    if (!canSend) return;
    const text = input.trim();
    setInput("");

    // Add user message
    setMessages((prev) => [
      ...prev,
      { role: "user", text, at: Date.now() },
    ]);

    setLoading(true);
    try {
      const data = await sendAiMessage({
        userId,
        conversationId: conversationId || null,
        message: text,
      });

      // adapte selon ta réponse backend
      const newConvId = data.conversationId ?? data.convId ?? conversationId;
      const reply = data.reply ?? data.aiReply ?? data.message ?? "";

      if (newConvId && newConvId !== conversationId) setConversationId(newConvId);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: reply || "Je n’ai pas pu générer une réponse.", at: Date.now() },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Désolé, erreur de connexion au serveur. Réessaie.",
          at: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  function clearChat() {
    setMessages([]);
    setConversationId("");
    localStorage.removeItem("ai_messages");
    localStorage.removeItem("ai_conversation_id");
  }

  return (
    <>
      {/* Floating button (always visible) */}
      <button
        onClick={() => setOpen(true)}
        className={[
          "fixed bottom-5 left-5 z-[9999]",
          "h-14 w-14 rounded-2xl flex items-center justify-center",
          "border border-white/10 bg-black/70 backdrop-blur-xl",
          "shadow-[0_18px_60px_rgba(0,0,0,0.45)]",
          "transition-transform hover:scale-[1.03] active:scale-[0.98]",
          open ? "hidden" : "",
        ].join(" ")}
        style={{ boxShadow: `0 18px 60px rgba(0,0,0,0.45)` }}
        aria-label="Open AI Chat"
        title="BetterYou AI"
      >
        <div
          className="h-10 w-10 rounded-2xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${ACCENT} 0%, rgba(214,249,61,0.65) 100%)`,
          }}
        >
          <MessageCircle className="text-black" size={22} />
        </div>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-5 left-5 z-[9999] w-[360px] max-w-[92vw]">
          <div className="rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${ACCENT} 0%, rgba(214,249,61,0.55) 100%)`,
                  }}
                >
                  <Sparkles className="text-black" size={20} />
                </div>
                <div className="leading-tight">
                  <div className="text-white font-semibold">BetterYou AI</div>
                  <div className="text-white/60 text-xs">Nutrition • Sport • Habitudes</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="text-white/60 hover:text-white text-xs px-3 py-2 rounded-2xl border border-white/10 bg-white/5"
                  title="Reset"
                >
                  Reset
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="h-10 w-10 rounded-2xl flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10"
                  aria-label="Close"
                >
                  <X className="text-white/80" size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              className="px-4 py-4 h-[320px] overflow-y-auto space-y-3"
            >
              {messages.length === 0 && (
                <div className="text-white/70 text-sm leading-relaxed">
                  Pose-moi une question sur ton objectif (perte de poids, prise de masse, programme sport, sommeil…)
                </div>
              )}

              {messages.map((m, idx) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={idx}
                    className={[
                      "flex",
                      isUser ? "justify-end" : "justify-start",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed",
                        isUser
                          ? "bg-white/10 text-white border border-white/10"
                          : "text-black",
                      ].join(" ")}
                      style={
                        isUser
                          ? {}
                          : {
                              background: `linear-gradient(135deg, ${ACCENT} 0%, rgba(214,249,61,0.85) 100%)`,
                            }
                      }
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-3xl px-4 py-3 text-sm bg-white/5 border border-white/10 text-white/70 flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    Génération...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10 bg-black/60">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder="Écris ton message…"
                  className="flex-1 resize-none rounded-3xl px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-4"
                  style={{ boxShadow: `0 0 0 0 rgba(214,249,61,0.0)` }}
                />
                <button
                  onClick={onSend}
                  disabled={!canSend}
                  className={[
                    "h-11 w-11 rounded-2xl flex items-center justify-center",
                    "border border-white/10",
                    canSend ? "bg-white/10 hover:bg-white/15" : "bg-white/5 opacity-60",
                  ].join(" ")}
                  title="Send"
                >
                  <Send className={canSend ? "text-white" : "text-white/60"} size={18} />
                </button>
              </div>

              <div className="mt-2 text-[11px] text-white/45">
                L’assistant répond uniquement sport/nutrition. Pas de diagnostic médical.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
