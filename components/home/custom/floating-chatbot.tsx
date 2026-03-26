"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, SendHorizontal, Sparkles, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Sender = "bot" | "user";

type Message = {
  id: string;
  text: string;
  sender: Sender;
  timeLabel: string;
};

const QUICK_PROMPTS = [
  "Apa itu SDGS Telkom University",
  "Apa Itu SDGS Hub",
] as const;

const INITIAL_MESSAGES: Message[] = [];

function buildReply(question: string) {
  const normalized = question.toLowerCase();

  if (
    normalized.includes("sdgs telkom university") ||
    normalized.includes("sdg telkom university")
  ) {
    return "SDGs Telkom University adalah inisiatif kampus untuk mendorong pendidikan, riset, inovasi, dan kolaborasi yang selaras dengan Sustainable Development Goals. Melalui platform ini, informasi program, berita, dan kontribusi Telkom University terhadap target SDGs bisa diakses lebih mudah.";
  }

  if (normalized.includes("sdgs hub") || normalized.includes("sdg hub")) {
    return "SDGs Hub adalah ruang kolaborasi digital yang membantu sivitas akademika mengembangkan ide, riset, dan inovasi berbasis SDGs. Di dalamnya, pengguna bisa menjelajahi peluang, mengelola proyek, dan menemukan koneksi dengan ekosistem SDGs Telkom University.";
  }

  return "Saya paling siap menjawab pertanyaan seputar SDGs Telkom University dan SDGs Hub. Anda juga bisa memakai tombol pertanyaan cepat yang sudah disediakan.";
}

function createMessage(text: string, sender: Sender): Message {
  return {
    id: `${sender}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    sender,
    timeLabel: new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date()),
  };
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  const hasConversation = messages.length > 0;

  const quickPrompts = useMemo(() => QUICK_PROMPTS, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [isOpen, isTyping, messages]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const pushBotReply = (question: string) => {
    timerRef.current = window.setTimeout(() => {
      setMessages((current) => [...current, createMessage(buildReply(question), "bot")]);
      setIsTyping(false);
    }, 700);
  };

  const sendMessage = (rawText: string) => {
    const text = rawText.trim();
    if (!text || isTyping) return;

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    setMessages((current) => [...current, createMessage(text, "user")]);
    setDraft("");
    setIsTyping(true);
    pushBotReply(text);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(draft);
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-[10rem] z-[70] flex justify-end px-4 sm:bottom-[9.5rem] sm:px-6">
        <motion.button
          type="button"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Tutup chatbot SDGs" : "Buka chatbot SDGs"}
          onClick={() => setIsOpen((current) => !current)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="pointer-events-auto relative flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full border border-[#f6c6cb] bg-[linear-gradient(135deg,#9f1118_0%,#d8252f_60%,#ef7077_100%)] text-white shadow-[0_24px_50px_rgba(159,17,24,0.34)]"
        >
          <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border border-white/80 bg-[#ffd5d8]" />
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/14 shadow-inner shadow-white/10">
            {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 bottom-[14rem] z-[80] flex h-[min(68vh,34rem)] flex-col overflow-hidden rounded-[2rem] border border-[#f7b8bf] bg-[linear-gradient(180deg,#ffd8dd_0%,#fff8f8_18%,#fff4f5_100%)] shadow-[0_32px_80px_rgba(118,10,18,0.22)] sm:right-6 sm:bottom-[13.5rem] sm:left-auto sm:w-[23rem]"
          >
            <div className="relative overflow-hidden border-b border-[#f4c7cd] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,244,245,0.88)_100%)] px-4 pb-3 pt-3">
              <div className="absolute inset-x-6 top-0 h-14 rounded-full bg-[#ff8f98]/20 blur-3xl" />
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.1rem] border border-white/60 bg-[linear-gradient(160deg,#d2131d_0%,#8f1017_100%)] text-white shadow-[0_16px_28px_rgba(143,16,23,0.36)]">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#9f1118]/65">
                      SDGs Tel-Utizen
                    </p>
                    <h2 className="text-lg font-semibold text-[#7f0e15]">
                      SDGs AI
                    </h2>
                    <p className="mt-0.5 text-sm text-[#90373e]">
                      Tanya cepat seputar SDGs Telkom University.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#f1c1c7] bg-white/75 text-[#9f1118] transition hover:bg-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              <div className="mb-3 rounded-[1.35rem] border border-[#f5c6cb] bg-white/80 p-3 shadow-[0_12px_30px_rgba(177,35,43,0.06)] backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#b6252a]/70">
                  <Sparkles className="h-3.5 w-3.5" />
                  Pertanyaan cepat
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      disabled={isTyping}
                      className="rounded-full border border-[#efc3c8] bg-[#fff8f8] px-3 py-2 text-left text-xs font-medium leading-4 text-[#9f1118] transition hover:-translate-y-0.5 hover:border-[#d64b55] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {!hasConversation ? (
                  <div className="rounded-2xl border border-dashed border-[#efc7cc] bg-white/55 px-3 py-2.5 text-xs leading-5 text-[#9d5f65]">
                    Pilih pertanyaan cepat atau ketik pesan untuk mulai chat.
                  </div>
                ) : null}

                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: index === messages.length - 1 ? 0.04 : 0 }}
                    className={cn(
                      "flex items-end gap-2",
                      message.sender === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    {message.sender === "bot" ? (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-[#b6252a] text-white shadow-[0_10px_18px_rgba(182,37,42,0.28)]">
                        <Bot className="h-4 w-4" />
                      </div>
                    ) : null}

                    <div
                      className={cn(
                        "max-w-[85%]",
                        message.sender === "user" ? "items-end text-right" : "items-start",
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-[1.5rem] px-4 py-3 text-sm leading-6 shadow-[0_14px_24px_rgba(152,27,35,0.08)]",
                          message.sender === "bot"
                            ? "rounded-bl-md bg-[linear-gradient(180deg,#bf3038_0%,#a91920_100%)] text-white"
                            : "rounded-br-md border border-[#f4dde0] bg-white text-[#6a1f26]",
                        )}
                      >
                        {message.text}
                      </div>
                      <p className="mt-1 px-1 text-[0.68rem] font-medium text-[#b0767d]">
                        {message.timeLabel}
                      </p>
                    </div>
                  </motion.div>
                ))}

                <AnimatePresence>
                  {isTyping ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="flex items-end gap-2"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[#b6252a] text-white shadow-[0_10px_18px_rgba(182,37,42,0.28)]">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="rounded-[1.5rem] rounded-bl-md bg-[linear-gradient(180deg,#bf3038_0%,#a91920_100%)] px-4 py-3 shadow-[0_14px_24px_rgba(152,27,35,0.08)]">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-white/80" />
                          <span className="h-2 w-2 animate-pulse rounded-full bg-white/70 [animation-delay:120ms]" />
                          <span className="h-2 w-2 animate-pulse rounded-full bg-white/60 [animation-delay:240ms]" />
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <div ref={scrollRef} />
              </div>
            </div>

            <div className="border-t border-[#f4c7cd] bg-white/78 px-4 py-4 backdrop-blur-sm">
              <form onSubmit={handleSubmit}>
                <div className="rounded-[1.4rem] border border-[#f3d5d8] bg-white p-2 shadow-[0_12px_24px_rgba(147,22,31,0.08)]">
                  <div className="flex items-center gap-2">
                    <Input
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder="Ketik pertanyaan kamu di sini..."
                      className="h-12 border-none bg-transparent px-3 text-sm shadow-none focus-visible:ring-0"
                    />
                    <button
                      type="submit"
                      disabled={!draft.trim() || isTyping}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#df3640_0%,#ad1820_100%)] text-white shadow-[0_12px_20px_rgba(173,24,32,0.3)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      <SendHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
