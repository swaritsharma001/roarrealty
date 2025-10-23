import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-nav-border bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <div className="flex space-x-2"><img src="/fav.ico" className="h-12 w-12" alt="Logo" /></div>
            <span className="text-3xl font-bold text-primary">
              Roar Realty<span className="text-accent">.</span>
            </span>
          </a>

          {/* Drawer Button */}
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-8 w-8" />
          </Button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}