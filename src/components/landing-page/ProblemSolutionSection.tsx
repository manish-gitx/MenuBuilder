import { X, Check } from "lucide-react";

const problems = [
  "Outdated PDF menus clients can't read on mobile",
  "Spending hours reformatting Word documents",
  "No way to update menus between events",
  "Poor presentation hurts your brand image",
];

const solutions = [
  "Beautiful digital menus that work on any device",
  "Build a professional menu in under 5 minutes",
  "Update items, prices & availability in real-time",
  "Impress clients with a polished, modern look",
];

export function ProblemSolutionSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              The Problem We Solve
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              From messy PDFs to{" "}
              <span className="text-gradient-hero">stunning menus</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stop wasting hours on menu design. We handle the presentation so you can focus on the food.
            </p>
          </div>

          {/* Before / After Cards */}
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Before Card */}
            <div className="relative bg-white rounded-3xl border border-border p-8 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-500 rounded-t-3xl" />

              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 rounded-full px-3 py-1.5 text-sm font-semibold mb-4">
                  <X className="w-4 h-4" />
                  Before MenuCraft
                </div>
                <h3 className="text-2xl font-bold text-foreground">The old way</h3>
                <p className="text-muted-foreground mt-2 text-sm">What most caterers are still dealing with</p>
              </div>

              <ul className="space-y-4">
                {problems.map((problem, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-50 flex items-center justify-center mt-0.5">
                      <X className="w-3.5 h-3.5 text-red-500" />
                    </div>
                    <span className="text-foreground">{problem}</span>
                  </li>
                ))}
              </ul>

              {/* Fake "outdated" document visual */}
              <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-5 opacity-70">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-red-50 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-500">menu_final_v3_FINAL.pdf</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded w-full" />
                  <div className="h-2 bg-gray-200 rounded w-4/5" />
                  <div className="h-2 bg-gray-200 rounded w-3/5" />
                  <div className="mt-4 h-2 bg-gray-200 rounded w-full" />
                  <div className="h-2 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            </div>

            {/* After Card */}
            <div className="relative bg-white rounded-3xl border border-border p-8 overflow-hidden shadow-card">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-hero rounded-t-3xl" />

              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1.5 text-sm font-semibold mb-4">
                  <Check className="w-4 h-4" />
                  After MenuCraft
                </div>
                <h3 className="text-2xl font-bold text-foreground">The new way</h3>
                <p className="text-muted-foreground mt-2 text-sm">What 500+ caterers are doing instead</p>
              </div>

              <ul className="space-y-4">
                {solutions.map((solution, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">{solution}</span>
                  </li>
                ))}
              </ul>

              {/* Beautiful menu preview visual */}
              <div className="mt-8 bg-gradient-hero rounded-2xl p-5 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs opacity-80">Your Menu</div>
                    <div className="font-bold">Wedding Reception 2024</div>
                  </div>
                  <div className="text-xs bg-white/20 rounded-full px-3 py-1">Live</div>
                </div>
                <div className="space-y-2">
                  <div className="bg-white/20 rounded-xl px-3 py-2.5 text-sm font-medium">🥗 Appetizers (8)</div>
                  <div className="bg-white/20 rounded-xl px-3 py-2.5 text-sm font-medium">🍽️ Main Course (12)</div>
                  <div className="bg-white/20 rounded-xl px-3 py-2.5 text-sm font-medium">🍰 Desserts (6)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
