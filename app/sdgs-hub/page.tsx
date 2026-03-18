import { HubHeroSection } from "@/components/sdgs-hub/hub-hero-section";
import { HubBentoSection } from "@/components/sdgs-hub/hub-bento-section";
import { RisetPreviewSection } from "@/components/sdgs-hub/riset-preview-section";
import { IdeaPreviewSection } from "@/components/sdgs-hub/idea-preview-section";
import { KenapaHubSection } from "@/components/sdgs-hub/kenapa-hub-section";
import { HubCtaSection } from "@/components/sdgs-hub/hub-cta-section";

export default function SdgsHubPage() {
  return (
    <main className="min-h-screen bg-white">
      <HubHeroSection />
      <HubBentoSection />
      <RisetPreviewSection />
      <IdeaPreviewSection />
      <KenapaHubSection />
      <HubCtaSection />
    </main>
  );
}
