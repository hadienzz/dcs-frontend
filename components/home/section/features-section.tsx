"use client";

import { FeaturesSectionWithBentoGrid } from "@/components/ui/feature-section-with-bento-grid";

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-white" id="keunggulan">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_100%)]" />
      <div className="absolute left-[-8rem] top-10 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(15,23,42,0.06)_0%,_transparent_70%)] blur-3xl" />
      <div className="absolute right-[-6rem] bottom-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(148,163,184,0.12)_0%,_transparent_68%)] blur-3xl" />
      <div className="absolute inset-0 opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.5) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>
      <div className="relative">
        <FeaturesSectionWithBentoGrid />
      </div>
    </section>
  );
}
