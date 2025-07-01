import { Menu, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddressSearch from "./AddressSearch";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-13 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"></div>
            <span className="text-xl font-semibold text-gray-900">
              Maparium
            </span>
          </div>
        </div>
        <div className="flex-1 max-w-2xl mx-8">
          <AddressSearch />
        </div>
        <div className="flex items-center gap-2">
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
          <Button variant="ghost" size="sm" className="sm:hidden">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
