import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "MenuCraft transformed how we present our menus. We saw a 40% increase in bookings within the first month.",
    name: "Sarah Mitchell",
    role: "Executive Chef & Owner",
    initials: "SM",
    gradient: "from-orange-400 to-orange-600",
  },
  {
    quote: "I used to spend 3 hours updating our PDF menus. Now it takes 10 minutes and looks 10x better. Total game changer.",
    name: "James Okafor",
    role: "Catering Director",
    initials: "JO",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    quote: "Clients love receiving a beautiful menu link instead of a PDF attachment. It feels so much more professional.",
    name: "Priya Sharma",
    role: "Event Catering Specialist",
    initials: "PS",
    gradient: "from-yellow-400 to-amber-500",
  },
];

export function TestimonialSection() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Loved by{" "}
              <span className="text-gradient-hero">catering professionals</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Don&apos;t just take our word for it — here&apos;s what caterers are saying.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-border p-6 hover:shadow-card transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="flex-1 text-foreground leading-relaxed mb-6 text-[15px]">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className={`w-10 h-10 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{testimonial.name}</div>
                    <div className="text-muted-foreground text-xs">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rating summary */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-white border border-border rounded-full px-6 py-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="font-semibold text-foreground">4.9 out of 5</span>
              <span className="text-muted-foreground text-sm">from 200+ reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
