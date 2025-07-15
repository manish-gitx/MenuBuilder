import { ArrowRight } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

export function CTASection() {
  return (
    <section className="py-32 bg-gradient-hero text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Ready to Start?
          </h2>
          
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            Create your first beautiful menu in minutes
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <SignInButton mode="modal" fallbackRedirectUrl="/menus">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-lg font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-primary hover:bg-gray-50 px-8 py-4 h-auto">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </SignInButton>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-white/80">
            <span>✓ Free forever</span>
            <span>✓ No setup required</span>
            <span>✓ Start immediately</span>
          </div>
        </div>
      </div>
    </section>
  );
}