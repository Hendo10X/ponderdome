import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { AscendToEnlightenment } from "./components/AscendToEnlightenment";
import { FAQ } from "./components/FAQ";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground font-sans">
      <main className="w-full max-w-6xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center gap-24">
        <Hero />
        <HowItWorks />
        <AscendToEnlightenment />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}


