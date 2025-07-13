import { Star } from "lucide-react";

export function TestimonialSection() {
  return (
    <section className="py-32 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-12">
            <div className="flex justify-center mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-8 w-8 text-yellow-400 fill-current" />
              ))}
            </div>
            
            <blockquote className="text-2xl md:text-3xl text-foreground leading-relaxed font-medium">
              &ldquo;Transformed how we present menus. 40% increase in bookings!&rdquo;
            </blockquote>
            
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center text-white font-bold text-xl">
                SM
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">Sarah Mitchell</div>
                <div className="text-muted-foreground">Executive Chef & Owner</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}