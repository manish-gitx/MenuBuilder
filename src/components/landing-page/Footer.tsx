import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div>
            <h3 className="text-3xl font-bold mb-4 text-white">MenuCraft</h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Beautiful menus for modern catering businesses
            </p>
          </div>
          
          <div className="flex justify-center gap-6">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
              <a 
                key={index}
                href="#" 
                className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-primary transition-colors"
              >
                <Icon className="h-6 w-6" />
              </a>
            ))}
          </div>
          
          <div className="border-t border-white/10 pt-8 text-gray-300">
            <p>&copy; 2024 MenuCraft. Made with care for catering professionals.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}