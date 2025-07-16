'use client'

import { HeroSection } from "@/components/landing-page/HeroSection";
import { ProblemSolutionSection } from "@/components/landing-page/ProblemSolutionSection";
import { FeaturesSection } from "@/components/landing-page/FeaturesSection";
import { BenefitsSection } from "@/components/landing-page/BenefitsSection";
import { TestimonialSection } from "@/components/landing-page/TestimonialSection";
import { CTASection } from "@/components/landing-page/CTASection";
import { Footer } from "@/components/landing-page/Footer";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export default function Home() {
  const { isLoading } = useRequireAuth({ redirectIfAuthenticated: true });

  // Show loading while checking auth
  if (isLoading) {
    return <LoadingScreen variant="light" />
  }

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <BenefitsSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
}
