import { HeroSection } from "@/components/landing-page/HeroSection";
import { ProblemSolutionSection } from "@/components/landing-page/ProblemSolutionSection";
import { FeaturesSection } from "@/components/landing-page/FeaturesSection";
import { BenefitsSection } from "@/components/landing-page/BenefitsSection";
import { TestimonialSection } from "@/components/landing-page/TestimonialSection";
import { CTASection } from "@/components/landing-page/CTASection";
import { Footer } from "@/components/landing-page/Footer";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  // Check if user is authenticated
  const { userId } = await auth();
  
  // If authenticated, redirect to dashboard
  if (userId) {
    redirect("/menus");
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
