import { Grid3X3, ImagePlus, Settings, Share2 } from "lucide-react";

const features = [
  {
    icon: Grid3X3,
    title: "Smart Organization",
    description: "Organize your menu with custom categories that make sense for your business."
  },
  {
    icon: ImagePlus,
    title: "Beautiful Visuals",
    description: "Upload high-quality photos that make your dishes look irresistible."
  },
  {
    icon: Settings,
    title: "Full Control",
    description: "Add descriptions, pricing, and dietary info. Customize every detail."
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Generate professional menus that look great on any device."
  }
];

export function FeaturesSection() {
  return (
    <section className="py-32 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything You Need
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple tools that make menu creation effortless
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="text-center group"
            >
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}