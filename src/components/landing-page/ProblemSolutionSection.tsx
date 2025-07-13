import { AlertTriangle, CheckCircle } from "lucide-react";

export function ProblemSolutionSection() {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-16">
            From Chaos to <span className="text-primary">Clarity</span>
          </h2>
          
          <div className="flex justify-between gap-16 items-center">
            {/* Problem Side */}
            <div className="space-y-6">
              <div className="text-left">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-6">Before</h3>
              </div>
              
              <ul className="space-y-4 text-left">
                {[
                  "Outdated PDF menus",
                  "Hard to update",
                  "Poor presentation",
                  "Time-consuming"
                ].map((problem, index) => (
                  <li key={index} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <span>{problem}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Solution Side */}
            <div className="space-y-6">
              <div className="text-left">
                <CheckCircle className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-6">After</h3>
              </div>
              
              <ul className="space-y-4 text-left">
                {[
                  "Beautiful digital menus",
                  "Update instantly",
                  "Professional look",
                  "Built in minutes"
                ].map((solution, index) => (
                  <li key={index} className="flex items-center gap-3 text-foreground font-medium">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}