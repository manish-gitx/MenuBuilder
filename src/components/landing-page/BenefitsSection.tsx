import { Clock, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

const stats = [
  { value: "5x", label: "Faster than Word docs" },
  { value: "40%", label: "More client bookings" },
  { value: "100%", label: "Mobile-friendly" },
];

const benefits = [
  {
    icon: Clock,
    title: "Save Hours Every Week",
    description: "Our drag-and-drop builder and smart templates let you create beautiful menus in minutes, not hours. Spend more time on what matters — cooking.",
    points: ["Pre-built category templates", "Drag & drop reordering", "Bulk item management"],
  },
  {
    icon: Sparkles,
    title: "Look Like a Pro",
    description: "First impressions matter. Give clients a polished, modern experience that reflects the quality of your catering — before they even taste the food.",
    points: ["Professional typography", "Beautiful image layouts", "Branded presentation"],
  },
  {
    icon: TrendingUp,
    title: "Win More Clients",
    description: "Caterers who use beautiful digital menus report higher client satisfaction and more repeat bookings. Your menu is your most powerful sales tool.",
    points: ["Shareable public link", "Works on any device", "PDF export for printing"],
  },
];

export function BenefitsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6 mb-20 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gradient-hero mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              Why MenuCraft
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Built for catering{" "}
              <span className="text-gradient-hero">professionals</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every feature is designed around how caterers actually work.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <div key={index} className="space-y-5">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <benefit.icon className="h-7 w-7 text-primary" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {benefit.description}
                  </p>
                </div>

                <ul className="space-y-2">
                  {benefit.points.map((point, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="bg-gradient-hero rounded-3xl p-8 md:p-12 text-white text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to transform your menu?
            </h3>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join 500+ catering professionals who have already made the switch.
            </p>
            <SignInButton mode="modal" fallbackRedirectUrl="/menus">
              <button className="inline-flex items-center gap-2 bg-white text-primary font-semibold text-lg px-8 py-4 rounded-full hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
                Start Creating — It&apos;s Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    </section>
  );
}
