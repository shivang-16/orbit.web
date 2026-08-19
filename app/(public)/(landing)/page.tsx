import { FaqSection } from "./_components/faq-section";
import { Hero } from "./_components/hero";
import { RouterSection } from "./_components/router-section";
import { SdkSection } from "./_components/sdk-section";

export default function LandingPage() {
  return (
    <main className="flex-1">
      <Hero />
      <SdkSection />
      <RouterSection />
      <FaqSection />
    </main>
  );
}
