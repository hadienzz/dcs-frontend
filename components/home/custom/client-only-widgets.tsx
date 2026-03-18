"use client";

import dynamic from "next/dynamic";

const FloatingVoiceOver = dynamic(() => import("./voice-over"), {
  ssr: false,
  loading: () => null,
});

const Widget = dynamic(() => import("./widget"), {
  ssr: false,
  loading: () => null,
});

export default function ClientOnlyWidgets() {
  const isIOS =
    typeof navigator !== "undefined" &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
  // Skip potentially heavy widgets on iOS to avoid Safari crashes
  if (isIOS) return null;
  return (
    <>
      <FloatingVoiceOver />
      <Widget />
    </>
  );
}
