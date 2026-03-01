import { ArrowRight, Sparkles, Star } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col bg-mesh overflow-hidden">
      {/* Navbar */}
      <nav className="relative z-20 px-6 py-5">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h18v2H3V3zm0 8h18v2H3v-2zm0 8h18v2H3v-2z" opacity="0.3"/>
                <path d="M8 6h13v2H8V6zm0 8h13v2H8v-2zM3 6h3v2H3V6zm0 8h3v2H3v-2z"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground">MenuCraft</span>
          </div>

          <div className="flex items-center gap-3">
            <SignInButton mode="modal" fallbackRedirectUrl="/menus">
              <button className="text-sm font-medium text-foreground hover:text-primary transition-colors px-4 py-2">
                Log in
              </button>
            </SignInButton>
            <SignInButton mode="modal" fallbackRedirectUrl="/menus">
              <button className="inline-flex items-center gap-2 text-sm font-semibold bg-primary text-white hover:bg-primary-hover transition-all duration-200 px-5 py-2.5 rounded-full shadow-warm hover:shadow-lg hover:-translate-y-0.5 transform">
                Get Started Free
              </button>
            </SignInButton>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="flex-1 flex items-center relative z-10">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-2 text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  Trusted by 500+ catering professionals
                </div>

                {/* Headline */}
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] tracking-tight">
                    Beautiful menus,
                    <br />
                    <span className="text-gradient-hero">built in minutes</span>
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                    Create stunning digital catering menus, share with clients instantly, and make a lasting first impression.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <SignInButton mode="modal" fallbackRedirectUrl="/menus">
                    <button className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold text-lg px-8 py-4 rounded-full shadow-warm hover:bg-primary-hover hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-200">
                      Start for Free
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </SignInButton>
                  <button className="inline-flex items-center justify-center gap-2 bg-white border border-border text-foreground font-semibold text-lg px-8 py-4 rounded-full hover:bg-muted hover:border-primary/30 transition-all duration-200">
                    See a Live Demo
                  </button>
                </div>

                {/* Trust Signals */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="font-medium text-foreground">4.9</span>
                    <span>rating</span>
                  </div>
                  <div className="w-px h-4 bg-border" />
                  <span>✓ Free to start</span>
                  <span>✓ No credit card needed</span>
                </div>
              </div>

              {/* Right Column - Visual */}
              <div className="relative lg:block">
                <div className="relative">
                  {/* Main card mockup */}
                  <div className="bg-white rounded-3xl shadow-2xl border border-border/50 overflow-hidden animate-float">
                    {/* Card header */}
                    <div className="bg-gradient-hero px-6 py-5">
                      <div className="text-white">
                        <div className="text-xs font-medium opacity-80 mb-1">Grand Wedding Catering</div>
                        <div className="text-xl font-bold">Summer Gala Menu 2024</div>
                        <div className="text-xs opacity-70 mt-1">48 items across 6 categories</div>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-6 space-y-4">
                      {/* Category */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-bold text-foreground">Appetizers</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">8 items</span>
                        </div>
                        <div className="space-y-2">
                          {[
                            { name: "Bruschetta Trio", desc: "Tomato, basil, balsamic" },
                            { name: "Stuffed Mushrooms", desc: "Cream cheese & herbs" },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                              <div>
                                <div className="text-sm font-medium text-foreground">{item.name}</div>
                                <div className="text-xs text-muted-foreground">{item.desc}</div>
                              </div>
                              <button className="text-xs font-semibold text-primary border border-primary/30 px-3 py-1 rounded-lg hover:bg-primary/5 transition-colors">
                                ADD
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-border/50" />

                      {/* Category 2 */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-bold text-foreground">Main Course</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">12 items</span>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-foreground">Herb Roasted Chicken</div>
                            <div className="text-xs text-muted-foreground">Rosemary, thyme, garlic</div>
                          </div>
                          <button className="text-xs font-semibold bg-primary/10 text-primary border border-primary/30 px-3 py-1 rounded-lg">
                            ADD
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Cart bar */}
                    <div className="mx-6 mb-6 bg-gradient-hero rounded-2xl px-5 py-3 flex items-center justify-between text-white">
                      <span className="text-sm font-medium">3 items selected</span>
                      <span className="text-sm font-bold flex items-center gap-1">
                        View Cart →
                      </span>
                    </div>
                  </div>

                  {/* Floating stat cards */}
                  <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-card border border-border/50 px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Link shared!</div>
                      <div className="text-sm font-bold text-foreground">Menu live</div>
                    </div>
                  </div>

                  <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-card border border-border/50 px-4 py-3">
                    <div className="text-xs text-muted-foreground mb-1">Created in</div>
                    <div className="text-2xl font-bold text-gradient-hero">3 mins</div>
                    <div className="text-xs text-muted-foreground">avg. setup time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 border-t border-border/50 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: "500+", label: "Menus Created" },
              { value: "1,200+", label: "Happy Clients" },
              { value: "98%", label: "Satisfaction Rate" },
              { value: "3 min", label: "Avg Setup Time" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-gradient-hero">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
