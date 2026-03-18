"use client";

import { Features } from "@/components/ui/features-8";

export function SdgUnggulanSection() {
  return (
    <div
      id="video"
      className="relative overflow-hidden bg-white"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(250,250,250,1)_100%)]" />
      <div className="absolute inset-0 opacity-[0.055]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(17,24,39,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(17,24,39,0.55) 1px, transparent 1px)",
            backgroundSize: "38px 38px",
          }}
        />
      </div>
      <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.035),_transparent_58%)]" />
      <Features />
    </div>
  );
}
