import { Check, Github, Link2, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AddressSearch from "./AddressSearch";
import mapariumLogo from "@/assets/maparium_logo.svg";

export default function Navbar({
  apiKey,
  mapController,
  legendEntries = [],
  theme,
  onThemeToggle,
}) {
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
    <div className="fixed top-4 left-1/2 z-40 flex w-[min(calc(100vw-2rem),56rem)] -translate-x-1/2 flex-col items-center gap-2 px-4">
      <nav className="w-full rounded-xl border border-border/70 bg-background/95 shadow-lg backdrop-blur dark:border-white/20 dark:bg-card/95 dark:shadow-black/45">
        <div className="flex flex-col items-center gap-4 px-4 py-2 md:flex-row md:py-0 md:min-h-13">
          {/* Top row: Logo and GitHub button */}
          <div className="flex min-w-0 items-center justify-between w-full md:w-auto md:flex-1">
            {/* Logo */}
            <a
              href="/"
              className="flex min-w-0 items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img src={mapariumLogo} alt="Maparium Logo" className="h-8 w-8" />
              <span className="truncate text-base font-semibold text-foreground md:text-xl max-[360px]:hidden">
                Maparium
              </span>
            </a>

            {/* GitHub button - visible on mobile */}
            <div className="flex items-center gap-2 md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={onThemeToggle}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-amber-500" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-700" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShareLink}
                aria-label={
                  shareState === "copied"
                    ? "Share link copied"
                    : shareState === "error"
                      ? "Retry copying share link"
                      : "Copy share link"
                }
              >
                {shareState === "copied" ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Link2 className="text-muted-foreground h-4 w-4" />
                )}
                <span className="sr-only">
                  {shareState === "copied"
                    ? "Copied"
                    : shareState === "error"
                      ? "Retry"
                      : "Share"}
                </span>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://github.com/matymm347/maparium"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open GitHub repository"
                >
                  <Github className="text-muted-foreground hover:text-foreground h-4 w-4 transition-colors" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Search - second row on mobile, inline on desktop */}
          <div className="w-full min-w-0 md:flex-1 md:max-w-lg md:mx-4 lg:mx-8">
            <AddressSearch apiKey={apiKey} mapController={mapController} />
          </div>

          {/* GitHub button - hidden on mobile, visible on desktop */}
          <div className="hidden shrink-0 md:flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onThemeToggle}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-slate-700" />
                  <span>Dark</span>
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShareLink}>
              {shareState === "copied" ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Link2 className="text-muted-foreground h-4 w-4" />
              )}
              <span>
                {shareState === "copied"
                  ? "Link copied"
                  : shareState === "error"
                    ? "Copy failed"
                    : "Share view"}
              </span>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a
                href="https://github.com/matymm347/maparium"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open GitHub repository"
              >
                <Github className="text-muted-foreground hover:text-foreground h-4 w-4 transition-colors" />
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
              className="flex items-center gap-2 rounded-full border border-border/80 bg-background/88 px-3 py-1.5 text-sm font-medium text-foreground shadow-md backdrop-blur-sm"
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
              className="text-muted-foreground flex items-center gap-2 rounded-full border border-border/80 bg-background/88 px-3 py-1.5 text-sm font-medium shadow-md backdrop-blur-sm"
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
