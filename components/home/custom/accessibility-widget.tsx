/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Settings, X } from "lucide-react";

type CursorMode = "default" | "big" | "crosshair";
type TextAlignMode = "default" | "left" | "center" | "justify";

type A11yState = {
  highContrast: boolean;
  fontScale: number; // 1.0 - 2.0
  letterSpacing: number; // em
  wordSpacing: number; // em
  lineHeight: number; // unitless (1 - 2)
  hideImages: boolean;
  dyslexia: boolean;
  cursor: CursorMode;
  textAlign: TextAlignMode;
  saturation: number; // 0 - 200 (%)

  // === Voice Over prefs ===
  voiceName: string | null;
  voiceRate: number; // 0.5 - 1.5
  voicePitch: number; // 0.5 - 2
};

const DEFAULT_STATE: A11yState = {
  highContrast: false,
  fontScale: 1.0,
  letterSpacing: 0,
  wordSpacing: 0,
  lineHeight: 1.6,
  hideImages: false,
  dyslexia: false,
  cursor: "default",
  textAlign: "default",
  saturation: 100,

  voiceName: null,
  voiceRate: 1,
  voicePitch: 1,
};

const STORAGE_KEY = "a11y_prefs_v1";

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState<A11yState>(DEFAULT_STATE);

  // === Voice Over runtime state ===
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const queueRef = useRef<SpeechSynthesisUtterance[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  // Util clamp untuk mencegah value keluar dari batas
  const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, Number.isFinite(v) ? v : min));

  // Muat preferensi
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setS({ ...DEFAULT_STATE, ...JSON.parse(raw) });
    } catch {}
  }, []);

  // Terapkan preferensi ke <html>
  useEffect(() => {
    const root = document.documentElement;

    // CSS variables
    root.style.setProperty("--a11y-font-scale", String(s.fontScale));
    root.style.setProperty("--a11y-letter-spacing", `${s.letterSpacing}em`);
    root.style.setProperty("--a11y-word-spacing", `${s.wordSpacing}em`);
    root.style.setProperty("--a11y-line-height", String(s.lineHeight));
    root.style.setProperty("--a11y-saturation", `${s.saturation}%`);

    // kelas kontras
    root.classList.toggle("a11y-contrast", s.highContrast);

    // sembunyikan gambar
    root.classList.toggle("a11y-hide-images", s.hideImages);

    // dyslexia font
    root.classList.toggle("a11y-dyslexia", s.dyslexia);

    // cursor
    root.classList.toggle("a11y-cursor-big", s.cursor === "big");
    root.classList.toggle("a11y-cursor-crosshair", s.cursor === "crosshair");
    if (s.cursor === "default") {
      root.classList.remove("a11y-cursor-big", "a11y-cursor-crosshair");
    }

    // text alignment
    root.classList.toggle("a11y-text-left", s.textAlign === "left");
    root.classList.toggle("a11y-text-center", s.textAlign === "center");
    root.classList.toggle("a11y-text-justify", s.textAlign === "justify");
    if (s.textAlign === "default") {
      root.classList.remove(
        "a11y-text-left",
        "a11y-text-center",
        "a11y-text-justify",
      );
    }

    // simpan
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {}
  }, [s]);

  // Tutup panel dengan ESC saat terbuka dan fokuskan panel ketika dibuka
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    // fokuskan panel untuk akses keyboard
    panelRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Bersihkan TTS ketika komponen dilepas
  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis?.cancel();
      } catch {}
    };
  }, []);

  // === Voice Over: init voices ===
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok =
      "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    setVoiceSupported(ok);
    if (!ok) return;

    const load = () => {
      const v = window.speechSynthesis.getVoices() || [];
      const sorted = [...v].sort(
        (a, b) =>
          (b.lang.startsWith("id") ? 1 : 0) -
            (a.lang.startsWith("id") ? 1 : 0) || a.name.localeCompare(b.name),
      );
      setVoices(sorted);
      // set default voice if none
      if (!s.voiceName && sorted.length) {
        setS((o) => ({ ...o, voiceName: sorted[0].name }));
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedVoice = useMemo(() => {
    return (
      voices.find((v) => v.name === s.voiceName) ||
      voices.find((v) => v.lang.startsWith("id")) ||
      voices[0] ||
      null
    );
  }, [voices, s.voiceName]);

  // === Voice Over: helpers ===
  function extractVisibleText(): string {
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
    const collect = (root: Element) => {
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
        {
          acceptNode(node: Node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as Element;
              if (blacklist.has(el.tagName)) return NodeFilter.FILTER_REJECT;
              if (!isVisible(el)) return NodeFilter.FILTER_REJECT;
              if (el.getAttribute("aria-hidden") === "true")
                return NodeFilter.FILTER_REJECT;
              if (
                el.closest(
                  "nav, footer, aside, [role='navigation'], [role='complementary']",
                )
              )
                return NodeFilter.FILTER_REJECT;
              if (
                el.closest("button, [role='button'], input, textarea, select")
              )
                return NodeFilter.FILTER_SKIP;
              return NodeFilter.FILTER_SKIP;
            } else if (node.nodeType === Node.TEXT_NODE) {
              const text = node.nodeValue?.replace(/\s+/g, " ").trim();
              if (text && text.length > 1) return NodeFilter.FILTER_ACCEPT;
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_SKIP;
          },
        } as any,
      );
      let n: Node | null = walker.nextNode();
      while (n) {
        if (n.nodeType === Node.TEXT_NODE) {
          chunks.push((n.nodeValue || "").replace(/\s+/g, " ").trim());
        }
        n = walker.nextNode();
      }
    };
    roots.forEach(collect);
    return chunks
      .join(" ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function getSelectionText(): string {
    const sel = window.getSelection();
    return sel ? sel.toString().replace(/\s+/g, " ").trim() : "";
  }

  function splitForUtterance(text: string, maxLen = 1800): string[] {
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
        slice.lastIndexOf("？"),
        slice.lastIndexOf(" "),
      );
      if (lastBreak <= 0) lastBreak = maxLen;
      parts.push(remaining.slice(0, lastBreak + 1));
      remaining = remaining.slice(lastBreak + 1);
    }
    if (remaining.trim()) parts.push(remaining.trim());
    return parts;
  }

  function clearQueue() {
    window.speechSynthesis.cancel();
    queueRef.current = [];
    setSpeaking(false);
    setPaused(false);
  }

  function enqueueText(text: string) {
    if (!text) return;
    const parts = splitForUtterance(text);
    queueRef.current = parts.map((p, idx) => {
      const u = new SpeechSynthesisUtterance(p);
      if (selectedVoice) {
        u.voice = selectedVoice;
        u.lang = selectedVoice.lang;
      } else {
        u.lang = "id-ID";
      }
      u.rate = s.voiceRate;
      u.pitch = s.voicePitch;
      u.onstart = () => setSpeaking(true);
      u.onend = () => {
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
    queueRef.current.forEach((u) => window.speechSynthesis.speak(u));
  }

  function readPage() {
    clearQueue();
    enqueueText(extractVisibleText());
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

  const resetAll = () => {
    clearQueue();
    setS(DEFAULT_STATE);
  };

  return (
    <>
      {/* FAB kiri bawah */}
      <button
        aria-label="Aksesibilitas"
        aria-controls="a11y-panel"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 left-6 z-50 inline-flex items-center justify-center rounded-full bg-[#b6252a] text-white shadow-lg hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-[#b6252a]/30"
        style={{
          // Netralisir efek pembesaran global pada ukuran FAB dan ikon
          width: "calc(3rem / var(--a11y-font-scale))", // h-12
          height: "calc(3rem / var(--a11y-font-scale))", // w-12
          fontSize: "calc(1rem / var(--a11y-font-scale))",
          lineHeight: 1.2,
        }}
      >
        {open ? (
          <X
            className=""
            style={{
              width: "calc(1.25rem / var(--a11y-font-scale))", // h-5
              height: "calc(1.25rem / var(--a11y-font-scale))", // w-5
            }}
          />
        ) : (
          <Settings
            className=""
            style={{
              width: "calc(1.25rem / var(--a11y-font-scale))",
              height: "calc(1.25rem / var(--a11y-font-scale))",
            }}
          />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          id="a11y-panel"
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-label="Panel aksesibilitas"
          className="fixed bottom-24 left-6 z-[99999] w-[320px] max-w-[90vw] rounded-2xl border border-gray-200 bg-white/95 backdrop-blur p-4 shadow-2xl"
          style={{
            // Netralisir pembesaran font global: kembalikan basis 16px di dalam panel
            fontSize: "calc(1rem / var(--a11y-font-scale))",
            letterSpacing: "normal",
            wordSpacing: "normal",
            lineHeight: 1.5,
          }}
        >
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Aksesibilitas
            </h3>
            <p className="text-xs text-gray-500">
              Sesuaikan tampilan agar lebih nyaman dibaca.
            </p>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-auto pr-1">
            {/* Kontras */}
            <Row>
              <Label>Kontras Tinggi</Label>
              <Toggle
                checked={s.highContrast}
                onChange={(v) => setS((o) => ({ ...o, highContrast: v }))}
              />
            </Row>
            {/* Teks lebih besar */}
            <Block>
              <Label className="mb-2">Ukuran Teks</Label>
              <input
                type="range"
                min={100}
                max={200}
                step={5}
                value={Math.round(s.fontScale * 100)}
                onChange={(e) =>
                  setS((o) => ({
                    ...o,
                    fontScale: clamp(Number(e.target.value) / 100, 1, 2),
                  }))
                }
                className="w-full"
              />
              <Hint>{Math.round(s.fontScale * 100)}%</Hint>
            </Block>
            {/* Spasi teks */}
            <Block>
              <Label className="mb-2">Spasi Teks</Label>
              <div className="grid grid-cols-3 gap-2">
                <NumInput
                  label="Huruf"
                  value={s.letterSpacing}
                  step={0.02}
                  min={0}
                  max={0.3}
                  onChange={(v) =>
                    setS((o) => ({ ...o, letterSpacing: clamp(v, 0, 0.3) }))
                  }
                />
                <NumInput
                  label="Kata"
                  value={s.wordSpacing}
                  step={0.1}
                  min={0}
                  max={1.5}
                  onChange={(v) =>
                    setS((o) => ({ ...o, wordSpacing: clamp(v, 0, 1.5) }))
                  }
                />
                <NumInput
                  label="Line"
                  value={s.lineHeight}
                  step={0.1}
                  min={1}
                  max={2}
                  onChange={(v) =>
                    setS((o) => ({ ...o, lineHeight: clamp(v, 1, 2) }))
                  }
                />
              </div>
            </Block>
            {/* Sembunyikan gambar */}
            <Row>
              <Label>Sembunyikan Gambar</Label>
              <Toggle
                checked={s.hideImages}
                onChange={(v) => setS((o) => ({ ...o, hideImages: v }))}
              />
            </Row>
            {/* Ramah disleksia */}
            <Row>
              <Label>Font Disleksia</Label>
              <Toggle
                checked={s.dyslexia}
                onChange={(v) => setS((o) => ({ ...o, dyslexia: v }))}
              />
            </Row>
            {/* Kursor */}
            <Block>
              <Label className="mb-2">Kursor</Label>
              <div className="flex gap-2">
                <Pill
                  active={s.cursor === "default"}
                  onClick={() => setS((o) => ({ ...o, cursor: "default" }))}
                >
                  Default
                </Pill>
                <Pill
                  active={s.cursor === "big"}
                  onClick={() => setS((o) => ({ ...o, cursor: "big" }))}
                >
                  Besar
                </Pill>
                <Pill
                  active={s.cursor === "crosshair"}
                  onClick={() => setS((o) => ({ ...o, cursor: "crosshair" }))}
                >
                  Crosshair
                </Pill>
              </div>
            </Block>
            {/* Perataan teks */}
            <Block>
              <Label className="mb-2">Perataan Teks</Label>
              <div className="flex flex-wrap gap-2">
                {(
                  ["default", "left", "center", "justify"] as TextAlignMode[]
                ).map((m) => (
                  <Pill
                    key={m}
                    active={s.textAlign === m}
                    onClick={() => setS((o) => ({ ...o, textAlign: m }))}
                  >
                    {m === "default"
                      ? "Default"
                      : m === "left"
                        ? "Kiri"
                        : m === "center"
                          ? "Tengah"
                          : "Rata Kanan-Kiri"}
                  </Pill>
                ))}
              </div>
            </Block>
            {/* Kejenuhan warna */}
            <Block>
              <Label className="mb-2">Kejenuhan Warna</Label>
              <input
                type="range"
                min={0}
                max={200}
                step={5}
                value={s.saturation}
                onChange={(e) =>
                  setS((o) => ({
                    ...o,
                    saturation: clamp(Number(e.target.value), 0, 200),
                  }))
                }
                className="w-full"
              />
            </Block>

            {/* Voice Over */}
            {voiceSupported && (
              <Block>
                <Label className="mb-2">Voice Over</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Pill active={speaking && !paused} onClick={readPage}>
                    Baca Halaman
                  </Pill>
                  <Pill onClick={readSelection}>Baca Seleksi</Pill>
                  {speaking && (
                    <Pill onClick={togglePause}>
                      {paused ? "Lanjut" : "Jeda"}
                    </Pill>
                  )}
                  {speaking && <Pill onClick={clearQueue}>Stop</Pill>}
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-600">Suara</label>
                    <select
                      value={s.voiceName ?? ""}
                      onChange={(e) =>
                        setS((o) => ({ ...o, voiceName: e.target.value }))
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                    >
                      {voices.map((v) => (
                        <option key={v.name} value={v.name}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <NumInput
                      label="Kecepatan"
                      value={s.voiceRate}
                      step={0.1}
                      min={0.5}
                      max={1.5}
                      onChange={(v) =>
                        setS((o) => ({
                          ...o,
                          voiceRate: clamp(v, 0.5, 1.5),
                        }))
                      }
                    />
                    <NumInput
                      label="Nada"
                      value={s.voicePitch}
                      step={0.1}
                      min={0.5}
                      max={2}
                      onChange={(v) =>
                        setS((o) => ({
                          ...o,
                          voicePitch: clamp(v, 0.5, 2),
                        }))
                      }
                    />
                  </div>
                </div>
              </Block>
            )}

            {/* Reset */}
            <button
              onClick={resetAll}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset Semua
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- UI Kecil ---------- */
function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">{children}</div>
  );
}
function Block({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3">{children}</div>
  );
}
function Label({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`text-sm font-medium text-gray-900 ${className}`}>
      {children}
    </div>
  );
}
function Hint({ children }: { children: React.ReactNode }) {
  return <div className="mt-1 text-xs text-gray-500">{children}</div>;
}
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`h-6 w-11 rounded-full transition-colors ${checked ? "bg-[#b6252a]" : "bg-gray-300"}`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : ""}`}
      />
    </button>
  );
}
function Pill({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
        active
          ? "border-[#b6252a] bg-[#b6252a]/10 text-[#b6252a]"
          : "border-gray-300 text-gray-700 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}
function NumInput({
  label,
  value,
  step,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  step: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const id = useMemo(
    () => `n-${label}-${Math.random().toString(36).slice(2)}`,
    [label],
  );
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-xs text-gray-600">
        {label}
      </label>
      <input
        id={id}
        type="number"
        step={step}
        min={min}
        max={max}
        value={Number(value.toFixed(2))}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
      />
    </div>
  );
}
