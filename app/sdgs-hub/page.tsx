import { CsrFlowSection } from "@/components/sdgs-hub/csr-flow-section";
import { CsrProgramsSection } from "@/components/sdgs-hub/csr-programs-section";
import { HubBentoSection } from "@/components/sdgs-hub/hub-bento-section";
import { HubCtaSection } from "@/components/sdgs-hub/hub-cta-section";
import { HubHeroSection } from "@/components/sdgs-hub/hub-hero-section";
import { KenapaHubSection } from "@/components/sdgs-hub/kenapa-hub-section";

export default function SdgsHubPage() {
  return (
    <main className="min-h-screen bg-white">
      <HubHeroSection />
      <HubBentoSection />
      <CsrProgramsSection />
      <CsrFlowSection />
      <KenapaHubSection />
      <HubCtaSection />
    </main>
  );
}
