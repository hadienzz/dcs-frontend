"use client";

import dynamic from "next/dynamic";

const FloatingVoiceOver = dynamic(() => import("./voice-over"), {
  ssr: false,
  loading: () => null,
});

const FloatingChatbot = dynamic(() => import("./floating-chatbot"), {
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

  return (
    <>
      {!isIOS ? <FloatingVoiceOver /> : null}
      <FloatingChatbot />
      {!isIOS ? <Widget /> : null}
    </>
  );
}
