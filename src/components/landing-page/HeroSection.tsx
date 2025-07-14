import { ArrowRight, Play } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Header with Login */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-primary"></div>
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_') ? (
            <SignInButton mode="modal" fallbackRedirectUrl="/home">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-primary bg-primary text-primary-foreground hover:bg-primary-hover hover:text-white px-6 py-2 shadow-md">
                Sign In
              </button>
            </SignInButton>
          ) : (
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-primary bg-primary text-primary-foreground hover:bg-primary-hover hover:text-white px-6 py-2 shadow-md">
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-warm-cream/20"></div>
      
      <div className="container mx-auto px-6 py-32 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-12">
            {/* Main Content */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
                Beautiful Menus
                <br />
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Create stunning digital catering menus in minutes.
                <br />
                Professional, shareable, and always up-to-date.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_') ? (
                <SignInButton mode="modal" fallbackRedirectUrl="/home">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-lg font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary-hover shadow-warm hover:shadow-lg transform hover:-translate-y-0.5 px-8 py-4 h-auto">
                    Start Creating Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </SignInButton>
              ) : (
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-lg font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary-hover shadow-warm hover:shadow-lg transform hover:-translate-y-0.5 px-8 py-4 h-auto">
                  Start Creating Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              )}
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-lg font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-8 py-4 h-auto">
                <Play className="mr-2 h-5 w-5" />
                See How It Works
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-muted-foreground">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Free to try
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                No setup required
              </span>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="mt-20 relative">
            <div className="relative max-w-4xl mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://i.ibb.co/nNvVc0vx/hero-image.jpg"
                alt="Beautiful catering menu interface"
                width={1200}
                height={800}
                className="w-full h-auto rounded-3xl shadow-2xl border border-border/50"
                
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}