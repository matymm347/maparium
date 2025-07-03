import { useState } from "react";
import { Github, PanelTopClose, PanelBottomClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddressSearch from "./AddressSearch";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex h-13 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"></div>
            <span className="text-xl font-semibold text-gray-900">
              Maparium
            </span>
          </div>
          {/* Desktop: Search and GitHub, Mobile: Menu button */}
          <div className="flex-1 max-w-2xl mx-8 hidden sm:flex">
            <AddressSearch />
          </div>
          <div className="flex items-center gap-2">
            {/* Desktop: GitHub */}
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              <a
                href="https://github.com/matymm347/maparium"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            {/* Mobile: GitHub and Menu */}
            <div className="flex sm:hidden items-center gap-2">
              <Button variant="ghost" size="sm">
                <a
                  href="https://github.com/matymm347/maparium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navbar-row"
              >
                {mobileMenuOpen ? (
                  <PanelBottomClose className="h-5 w-5" />
                ) : (
                  <PanelTopClose className="h-5 w-5" />
                )}
                <span className="sr-only">Menu</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile: Search row, toggled by menu */}
      <div
        id="mobile-navbar-row"
        className={`${
          !mobileMenuOpen ? "flex" : "hidden"
        } items-center justify-between gap-2 px-4 py-2 sm:hidden border-b border-gray-200 bg-white/95 transition-all`}
      >
        <div className="flex-1">
          <AddressSearch />
        </div>
      </div>
    </>
  );
}
