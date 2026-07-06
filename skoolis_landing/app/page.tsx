import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/sections/hero-section";
import { TrustSection } from "@/sections/trust-section";
import { ProblemSection } from "@/sections/problem-section";
import { MobileShowcaseSection } from "@/sections/mobile-showcase-section";
import { ShowcaseSection } from "@/sections/showcase-section";
import { TestimonialsSection } from "@/sections/testimonials-section";
import { CommentsSection } from "@/sections/comments-section";
import { CtaSection } from "@/sections/cta-section";

export default function Home() {
  return (
    <>
      <Navbar />
      <main
        id="contenu-principal"
        className="relative flex-1 overflow-hidden bg-background [background-image:none]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[66vh] min-h-[34rem] bg-[linear-gradient(180deg,color-mix(in_oklch,var(--primary)_18%,var(--background))_0%,color-mix(in_oklch,var(--primary)_13%,var(--background))_48%,var(--background)_66%)]"
        />
        <div className="relative z-10">
          <HeroSection />
          <TrustSection />
          <ProblemSection />
          <MobileShowcaseSection />
          <ShowcaseSection />
          <TestimonialsSection />
          <CommentsSection />
          <CtaSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
