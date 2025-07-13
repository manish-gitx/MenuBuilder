
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-primary">MenuBuilder</div>
              <div className="text-sm text-muted-foreground">Dashboard</div>
            </div>
            <UserButton 
              showName 
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                  userButtonPopoverCard: "shadow-warm",
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Welcome to MenuMaker
              </h1>
              <p className="text-xl text-muted-foreground">
                Ready to create your first beautiful catering menu?
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="p-8 bg-card rounded-lg shadow-card border border-border/50">
                <h3 className="text-2xl font-semibold mb-4">Create New Menu</h3>
                <p className="text-muted-foreground mb-6">
                  Start from scratch and build a beautiful menu for your catering business
                </p>
                <button className="w-full bg-primary text-primary-foreground hover:bg-primary-hover px-6 py-3 rounded-lg font-medium transition-colors">
                  Create Menu
                </button>
              </div>
              
              <div className="p-8 bg-card rounded-lg shadow-card border border-border/50">
                <h3 className="text-2xl font-semibold mb-4">Browse Templates</h3>
                <p className="text-muted-foreground mb-6">
                  Choose from professionally designed templates to get started quickly
                </p>
                <button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-3 rounded-lg font-medium transition-colors">
                  View Templates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}