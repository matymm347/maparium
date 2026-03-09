import { Check, Github, Link2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AddressSearch from "./AddressSearch";
import mapariumLogo from "@/assets/maparium_logo.svg";

export default function Navbar({ apiKey, mapController, legendEntries = [] }) {
  const [shareState, setShareState] = useState("idle");
  const maxLegendChips = 4;
  const hasOverflow = legendEntries.length > maxLegendChips;
  const visibleLegendEntries = hasOverflow
    ? legendEntries.slice(0, maxLegendChips - 1)
    : legendEntries;
  const hiddenLegendEntries = hasOverflow
    ? legendEntries.slice(maxLegendChips - 1)
    : [];

  useEffect(() => {
    if (shareState === "idle") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShareState("idle");
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [shareState]);

  const copyTextToClipboard = async (text) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    const copySucceeded = document.execCommand("copy");
    document.body.removeChild(textarea);

    if (!copySucceeded) {
      throw new Error("Copy command failed");
    }
  };

  const handleShareLink = async () => {
    try {
      await copyTextToClipboard(window.location.href);
      setShareState("copied");
    } catch {
      setShareState("error");
    }
  };

  return (
    <div className="fixed top-4 left-1/2 z-40 flex w-[min(calc(100vw-2rem),50rem)] -translate-x-1/2 flex-col items-center gap-2 px-4">
      <nav className="w-full border border-gray-200 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:h-13 items-center px-4 gap-4 py-2 sm:py-0">
          {/* Top row: Logo and GitHub button */}
          <div className="flex items-center justify-between w-full sm:w-auto sm:flex-1">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img src={mapariumLogo} alt="Maparium Logo" className="h-8 w-8" />
              <span className="text-xl font-semibold text-gray-900">
                Maparium
              </span>
            </a>

            {/* GitHub button - visible on mobile */}
            <div className="flex items-center gap-2 sm:hidden">
              <Button variant="outline" size="sm" onClick={handleShareLink}>
                {shareState === "copied" ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Link2 className="h-4 w-4 text-gray-600" />
                )}
                <span>
                  {shareState === "copied"
                    ? "Copied"
                    : shareState === "error"
                      ? "Retry"
                      : "Share"}
                </span>
              </Button>
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
            <AddressSearch apiKey={apiKey} mapController={mapController} />
          </div>

          {/* GitHub button - hidden on mobile, visible on desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShareLink}>
              {shareState === "copied" ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Link2 className="h-4 w-4 text-gray-600" />
              )}
              <span>
                {shareState === "copied"
                  ? "Link copied"
                  : shareState === "error"
                    ? "Copy failed"
                    : "Share view"}
              </span>
            </Button>
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

      {visibleLegendEntries.length > 0 ? (
        <div className="flex w-full flex-wrap justify-center gap-2 px-1">
          {visibleLegendEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-2 rounded-full border border-white/70 bg-white/88 px-3 py-1.5 text-sm font-medium text-gray-800 shadow-md backdrop-blur-sm"
            >
              <span
                className="h-2.5 w-2.5 rounded-full shadow-sm"
                style={{ backgroundColor: entry.color }}
                aria-hidden="true"
              />
              <span>{entry.label}</span>
            </div>
          ))}
          {hiddenLegendEntries.length > 0 ? (
            <div
              className="flex items-center gap-2 rounded-full border border-gray-300/80 bg-white/88 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-md backdrop-blur-sm"
              title={hiddenLegendEntries.map((entry) => entry.label).join(", ")}
            >
              <span>+{hiddenLegendEntries.length} more</span>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
