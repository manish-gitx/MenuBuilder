import { Grid3X3, ImagePlus, Settings, Share2, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Grid3X3,
    title: "Smart Categories",
    description: "Organize your menu with unlimited custom categories and sub-categories that make sense for your business.",
    color: "bg-blue-50 text-blue-600",
    number: "01",
  },
  {
    icon: ImagePlus,
    title: "Beautiful Visuals",
    description: "Upload high-quality photos for each dish. Your food looks irresistible with our responsive image layout.",
    color: "bg-primary/10 text-primary",
    number: "02",
  },
  {
    icon: Settings,
    title: "Full Customization",
    description: "Add descriptions, dietary tags, spice levels, and custom labels. Control every detail of your menu.",
    color: "bg-purple-50 text-purple-600",
    number: "03",
  },
  {
    icon: Share2,
    title: "One-Click Sharing",
    description: "Generate a beautiful shareable link instantly. Clients get a stunning menu view on any device.",
    color: "bg-green-50 text-green-600",
    number: "04",
  },
  {
    icon: Zap,
    title: "Instant Updates",
    description: "Change an item or update a description — your live menu updates instantly without any re-sharing.",
    color: "bg-yellow-50 text-yellow-600",
    number: "05",
  },
  {
    icon: Shield,
    title: "Public & Private",
    description: "Keep menus private while building, then make them public when ready. Full control over visibility.",
    color: "bg-red-50 text-red-600",
    number: "06",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything you need to{" "}
              <span className="text-gradient-hero">build stunning menus</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools that make professional menu creation effortless — no design skills required.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl border border-border p-6 hover:shadow-card hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Number + Icon row */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-bold text-border group-hover:text-primary/20 transition-colors">
                    {feature.number}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
