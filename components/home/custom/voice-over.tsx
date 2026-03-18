/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type V = SpeechSynthesisVoice;

function extractVisibleText(): string {
  // Prioritaskan main/article, fallback body
  const roots: Element[] = [];
  const main = document.querySelector("main");
  const article = document.querySelector("article");
  if (main) roots.push(main);
  if (article && article !== main) roots.push(article);
  if (roots.length === 0) roots.push(document.body);

  const blacklist = new Set([
    "NAV",
    "FOOTER",
    "ASIDE",
    "SCRIPT",
    "STYLE",
    "NOSCRIPT",
    "IFRAME",
    "SVG",
    "CANVAS",
    "VIDEO",
    "AUDIO",
    "CODE",
    "PRE",
  ]);
  const isVisible = (el: Element) => {
    const style = window.getComputedStyle(el as HTMLElement);
    return style && style.display !== "none" && style.visibility !== "hidden";
  };

  const chunks: string[] = [];
  const walker = document.createTreeWalker(
    roots[0],
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    {
      acceptNode(node: Element) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as Element;
          if (blacklist.has(el.tagName)) return NodeFilter.FILTER_REJECT;
          if (!isVisible(el)) return NodeFilter.FILTER_REJECT;
          // Skip obvious chrome
          if (el.getAttribute("aria-hidden") === "true")
            return NodeFilter.FILTER_REJECT;
          if (
            el.closest(
              "nav, footer, aside, [role='navigation'], [role='complementary']"
            )
          )
            return NodeFilter.FILTER_REJECT;
          if (el.closest("button, [role='button'], input, textarea, select"))
            return NodeFilter.FILTER_SKIP;
          return NodeFilter.FILTER_SKIP;
        } else if (node.nodeType === Node.TEXT_NODE) {
          const text = node.nodeValue?.replace(/\s+/g, " ").trim();
          if (text && text.length > 1) return NodeFilter.FILTER_ACCEPT;
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_SKIP;
      },
    } as any
  );

  let n: Node | null = walker.nextNode();
  while (n) {
    if (n.nodeType === Node.TEXT_NODE) {
      chunks.push((n.nodeValue || "").replace(/\s+/g, " ").trim());
    }
    n = walker.nextNode();
  }

  // Gabungkan, rapikan spasi & baris
  const text = chunks
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();
  return text;
}

function getSelectionText(): string {
  const sel = window.getSelection();
  return sel ? sel.toString().replace(/\s+/g, " ").trim() : "";
}

function splitForUtterance(text: string, maxLen = 1800): string[] {
  // potong di akhir kalimat/tanda baca bila memungkinkan
  const parts: string[] = [];
  let remaining = text;
  while (remaining.length > maxLen) {
    const slice = remaining.slice(0, maxLen);
    let lastBreak = Math.max(
      slice.lastIndexOf(". "),
      slice.lastIndexOf("! "),
      slice.lastIndexOf("? "),
      slice.lastIndexOf("。"),
      slice.lastIndexOf("！"),
      slice.lastIndexOf("？")
    );
    if (lastBreak < maxLen * 0.6) lastBreak = slice.lastIndexOf(" ");
    if (lastBreak <= 0) lastBreak = maxLen;
    parts.push(remaining.slice(0, lastBreak + 1));
    remaining = remaining.slice(lastBreak + 1);
  }
  if (remaining.trim()) parts.push(remaining.trim());
  return parts;
}

function buildOutline(): { level: number; text: string }[] {
  const headings = Array.from(
    document.querySelectorAll("h1, h2, h3, h4, h5, h6")
  ) as HTMLElement[];
  return headings
    .filter((h) => !!h.innerText.trim())
    .map((h) => ({
      level: parseInt(h.tagName.substring(1), 10),
      text: h.innerText.trim(),
    }));
}

export default function FloatingVoiceOver() {
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState<V[]>([]);
  const [voiceName, setVoiceName] = useState<string>("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [open, setOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const queueRef = useRef<SpeechSynthesisUtterance[]>([]);
  const [outline, setOutline] = useState<{ level: number; text: string }[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok =
      "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    setSupported(ok);
    if (!ok) return;

    const load = () => {
      const v = window.speechSynthesis.getVoices();
      const sorted = [...v].sort(
        (a, b) =>
          (b.lang.startsWith("id") ? 1 : 0) -
            (a.lang.startsWith("id") ? 1 : 0) || a.name.localeCompare(b.name)
      );
      setVoices(sorted);
      if (!voiceName && sorted.length) setVoiceName(sorted[0].name);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [voiceName]);

  const selectedVoice = useMemo(
    () =>
      voices.find((v) => v.name === voiceName) ||
      voices.find((v) => v.lang.startsWith("id")) ||
      voices[0],
    [voices, voiceName]
  );

  function clearQueue() {
    window.speechSynthesis.cancel();
    queueRef.current = [];
    setSpeaking(false);
    setPaused(false);
  }

  function enqueueText(text: string) {
    const parts = splitForUtterance(text);
    queueRef.current = parts.map((p, idx) => {
      const u = new SpeechSynthesisUtterance(p);
      if (selectedVoice) {
        u.voice = selectedVoice;
        u.lang = selectedVoice.lang;
      } else {
        u.lang = "id-ID";
      }
      u.rate = rate;
      u.pitch = pitch;
      u.onstart = () => setSpeaking(true);
      u.onend = () => {
        // jika ini utter terakhir, reset speaking
        if (idx === parts.length - 1) {
          setSpeaking(false);
          setPaused(false);
        }
      };
      u.onerror = () => {
        if (idx === parts.length - 1) {
          setSpeaking(false);
          setPaused(false);
        }
      };
      return u;
    });
    // jalankan berantai
    queueRef.current.forEach((u) => window.speechSynthesis.speak(u));
  }

  function readPage() {
    clearQueue();
    const text = extractVisibleText();
    if (text) enqueueText(text);
  }

  function readSelection() {
    const text = getSelectionText();
    if (!text) return;
    clearQueue();
    enqueueText(text);
  }

  function togglePause() {
    if (!speaking) return;
    if (!paused) {
      window.speechSynthesis.pause();
      setPaused(true);
    } else {
      window.speechSynthesis.resume();
      setPaused(false);
    }
  }

  function refreshOutline() {
    setOutline(buildOutline());
  }

  // Auto build outline saat panel dibuka
  useEffect(() => {
    if (open) refreshOutline();
  }, [open]);

  if (!supported) {
    return null; // sembunyikan bila tidak didukung; bisa diganti toast info
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Voice Over"
        className="fixed bottom-24 right-5 z-50 rounded-full shadow-lg border bg-white/90 backdrop-blur px-4 py-3 text-sm hover:bg-white"
      >
        🔊 Voice
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-44 right-5 z-50 w-80 max-w-[90vw] rounded-2xl border bg-white/95 backdrop-blur shadow-xl">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="font-medium">Voice Over</div>
            <button
              onClick={() => setOpen(false)}
              className="text-sm opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>

          <div className="p-3 space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={readPage}
                className="rounded-md border px-3 py-2 text-sm hover:bg-black/5"
                title="Bacakan seluruh halaman"
              >
                📄 Baca Halaman
              </button>
              <button
                onClick={readSelection}
                className="rounded-md border px-3 py-2 text-sm hover:bg-black/5"
                title="Bacakan teks yang diseleksi"
              >
                ✂️ Baca Seleksi
              </button>
              {!speaking ? (
                <button
                  onClick={() => {
                    const text = extractVisibleText();
                    if (text) enqueueText(text);
                  }}
                  className="rounded-md border px-3 py-2 text-sm hover:bg-black/5"
                >
                  ▶️ Play
                </button>
              ) : (
                <>
                  <button
                    onClick={togglePause}
                    className="rounded-md border px-3 py-2 text-sm hover:bg-black/5"
                  >
                    {paused ? "⏯️ Resume" : "⏸️ Pause"}
                  </button>
                  <button
                    onClick={clearQueue}
                    className="rounded-md border px-3 py-2 text-sm hover:bg-black/5"
                  >
                    ⏹️ Stop
                  </button>
                </>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm flex items-center gap-2">
                Voice
                <select
                  className="rounded border px-2 py-1 grow"
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                >
                  {voices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm flex items-center gap-2">
                Rate
                <input
                  type="range"
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                />
                <span className="tabular-nums">{rate.toFixed(1)}</span>
              </label>

              <label className="text-sm flex items-center gap-2">
                Pitch
                <input
                  type="range"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                />
                <span className="tabular-nums">{pitch.toFixed(1)}</span>
              </label>
            </div>

            <div className="border-t pt-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Outline halaman</div>
                <button onClick={refreshOutline} className="text-xs underline">
                  Refresh
                </button>
              </div>
              <div className="mt-2 max-h-40 overflow-auto pr-1">
                {outline.length === 0 ? (
                  <p className="text-xs text-gray-500">
                    Tidak ada heading ditemukan. (Gunakan “Baca Halaman” untuk
                    tetap dibacakan.)
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {outline.map((h, i) => (
                      <li
                        key={i}
                        style={{ paddingLeft: (h.level - 1) * 12 }}
                        className="text-xs leading-snug"
                      >
                        {Array(h.level - 1)
                          .fill("•")
                          .join("")}{" "}
                        {h.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <p className="text-[11px] text-gray-500">
              Tips: iOS & beberapa browser butuh aksi klik sebelum suara bisa
              diputar. Pilih voice <b>id-ID</b> jika tersedia.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
