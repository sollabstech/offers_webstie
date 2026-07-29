"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, CheckCircle, ChevronDown } from "lucide-react";

interface Message {
  from: "user" | "bot";
  text: string;
}

const BOT_REPLIES: Record<string, string> = {
  order: "You can track your order from the 'Your Orders' section in your account. Need an order ID? Check your confirmation SMS or email.",
  return: "We offer easy 10-day returns. Go to Your Orders → select item → click 'Return or Replace'. Visit our Returns page for full details.",
  delivery: "Standard delivery takes 5–7 days (free above ₹499). Express delivery is 2–3 days for ₹99. Check our Shipping page for full info.",
  payment: "We accept PhonePe, Google Pay, Paytm, Credit/Debit Cards, and Cash on Delivery.",
  cancel: "You can cancel an order before it is shipped. Go to Your Orders and click 'Cancel Order'.",
  refund: "Refunds are processed within 1–7 business days depending on your payment method after we receive the returned item.",
  vendor: "Want to sell on Offerss? Visit our About page and click 'Become a Vendor' to get started!",
  account: "Go to 'Hello, sign in → Account & Lists' at the top of the page to access your account settings.",
};

function getBotReply(text: string): string {
  const lower = text.toLowerCase();
  for (const [key, reply] of Object.entries(BOT_REPLIES)) {
    if (lower.includes(key)) return reply;
  }
  return "Thanks for your question! Our support team will get back to you within 24 hours. You can also visit our Help Center for common topics.";
}

const QUICK = ["Track my order", "Return an item", "Delivery info", "Payment methods"];

export default function HelpBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "👋 Hi! I'm the Offerss Help Bot. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { from: "user", text: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      const reply = getBotReply(text);
      setMessages((m) => [...m, { from: "bot", text: reply }]);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close help chat" : "Open help chat"}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark transition-all hover:scale-105 active:scale-95"
      >
        {open ? <ChevronDown size={22} /> : <MessageCircle size={24} />}
        {!open && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[9px] font-bold flex items-center justify-center animate-pulse">
            ?
          </span>
        )}
      </button>

      {/* Chat popup */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl border border-border bg-surface shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: "480px" }}>

          {/* Header */}
          <div className="flex items-center justify-between bg-primary px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
                OB
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">Offerss Help Bot</p>
                <p className="text-white/70 text-xs">Usually replies instantly</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2" style={{ minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  msg.from === "user"
                    ? "bg-primary text-white rounded-br-sm"
                    : "bg-surface-alt text-text rounded-bl-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {QUICK.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="rounded-full border border-border bg-surface-alt px-3 py-1 text-xs text-text hover:border-primary hover:text-primary transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border px-3 py-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              className="flex-1 min-w-0 bg-surface-alt rounded-full px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary text-text placeholder:text-text-muted"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white disabled:opacity-40 hover:bg-primary-dark transition-colors shrink-0"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
