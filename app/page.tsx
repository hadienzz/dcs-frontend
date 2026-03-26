import { HeroSection } from "../components/home/section/hero-section";
import { FeaturesSection } from "../components/home/section/features-section";
import { SdgUnggulanSection } from "../components/home/section/sdg-unggulan-section";
import { QuotesSection } from "../components/home/section/quotes-section";
import { KepakaranSection } from "../components/home/section/kepakaran-section";
import { Footer } from "../components/home/section/footer";
import { Navbar } from "../components/home/section/navbar";
import NewsSection from "../components/home/section/news-section";
import { ProductSection } from "../components/home/section/product-section";
import IndonesiaMap from "../components/home/custom/map-proyek-indonesia";
import ClientOnlyWidgets from "../components/home/custom/client-only-widgets";
import { ScrollSection } from "@/components/ui/scroll-section";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ScrollSection>
        <IndonesiaMap />
      </ScrollSection>
      <ScrollSection>
        <FeaturesSection />
      </ScrollSection>
      <ScrollSection>
        <SdgUnggulanSection />
      </ScrollSection>
      <QuotesSection />
      <KepakaranSection />
      <ProductSection />
      <NewsSection />
      <ScrollSection y={18} duration={0.6}>
        <Footer />
      </ScrollSection>
      <ClientOnlyWidgets />
    </main>
  );
}
