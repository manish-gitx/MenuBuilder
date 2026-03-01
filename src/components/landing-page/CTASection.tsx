import { ArrowRight, Zap } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

export function CTASection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-hero rounded-3xl overflow-hidden p-12 md:p-16 text-white text-center">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm font-medium mb-8">
                <Zap className="w-4 h-4" />
                Get started in under 5 minutes
              </div>

              <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Your first menu is
                <br />
                waiting to be built
              </h2>

              <p className="text-xl text-white/80 max-w-xl mx-auto mb-10">
                Join 500+ catering professionals who use MenuCraft to create stunning menus and win more clients.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <SignInButton mode="modal" fallbackRedirectUrl="/menus">
                  <button className="inline-flex items-center justify-center gap-2 bg-white text-primary hover:bg-gray-50 font-semibold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform transition-all duration-200">
                    Create My First Menu
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </SignInButton>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-white/70 text-sm">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Free forever
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Start immediately
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
