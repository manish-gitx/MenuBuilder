import { Clock, TrendingUp, Sparkles } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Save Time",
    description: "Focus on cooking while we handle your menu design.",
  },
  {
    icon: Sparkles,
    title: "Look Professional",
    description: "Impress clients with polished, modern presentations.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Beautiful menus lead to more bookings and happy clients.",
  }
];

export function BenefitsSection() {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Made for Success
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join catering professionals who trust us to elevate their business
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="text-center group"
            >
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-3xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="h-10 w-10 text-primary" />
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}