import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddressSearch from "./AddressSearch";

export default function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 border border-gray-200 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row sm:h-13 items-center px-4 gap-4 py-2 sm:py-0">
        {/* Top row: Logo and GitHub button */}
        <div className="flex items-center justify-between w-full sm:w-auto sm:flex-1">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"></div>
            <span className="text-xl font-semibold text-gray-900">
              Maparium
            </span>
          </div>

          {/* GitHub button - visible on mobile */}
          <div className="sm:hidden">
            <Button variant="ghost" size="sm">
              <a
                href="https://github.com/matymm347/maparium"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4 text-gray-600 hover:text-gray-900 transition-colors" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Search - second row on mobile, inline on desktop */}
        <div className="w-full sm:flex-1 sm:max-w-lg sm:mx-10">
          <AddressSearch />
        </div>

        {/* GitHub button - hidden on mobile, visible on desktop */}
        <div className="hidden sm:block">
          <Button variant="ghost" size="sm">
            <a
              href="https://github.com/matymm347/maparium"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4 text-gray-600 hover:text-gray-900 transition-colors" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
