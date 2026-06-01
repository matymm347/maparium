import { Check, CircleDot, Info, Link2, Moon, Shield, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AddressSearch from "./AddressSearch";
import githubInvertocatWhite from "@/assets/GitHub_Invertocat_White.svg";
import mapariumLogo from "@/assets/maparium_logo.svg";
import { Link } from "react-router-dom";

export default function Navbar({
  apiKey,
  mapController,
  legendEntries = [],
  theme,
  onHomeNavigate,
  onThemeToggle,
  onAboutNavigate,
  onPrivacyNavigate,
  pathname,
  showSearch = true,
}) {
  const [shareState, setShareState] = useState("idle");
  const showShareButton =
    !pathname.startsWith("/about") && !pathname.startsWith("/privacy");
  const isPrivacyRoute = pathname === "/privacy";
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

  const handleAboutClick = (event) => {
    if (!onAboutNavigate || pathname === "/about") {
      return;
    }

    event.preventDefault();
    onAboutNavigate();
  };

  const handlePrivacyClick = (event) => {
    if (!onPrivacyNavigate || isPrivacyRoute) {
      return;
    }

    event.preventDefault();
    onPrivacyNavigate();
  };

  const handleHomeClick = (event) => {
    if (!onHomeNavigate) {
      return;
    }

    event.preventDefault();
    onHomeNavigate();
  };

  return (
    <div className="fixed top-4 left-1/2 z-40 flex w-[min(calc(100vw-2rem),56rem)] -translate-x-1/2 flex-col items-center gap-2 px-4">
      <nav className="relative z-20 w-full rounded-xl border border-border/70 bg-background/95 shadow-lg backdrop-blur dark:border-white/20 dark:bg-card/95 dark:shadow-black/45">
        <div className="flex flex-col items-center gap-4 px-4 py-2 md:flex-row md:flex-wrap md:items-center md:py-3 lg:flex-nowrap lg:py-0 lg:min-h-13">
          {/* Top row: Logo and utility actions */}
          <div className="flex min-w-0 items-center justify-between w-full md:w-auto md:flex-none">
            {/* Logo */}
            <Link
              to="/"
              onClick={handleHomeClick}
              className="flex min-w-0 items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img src={mapariumLogo} alt="Maparium Logo" className="h-8 w-8" />
              <span className="hidden truncate text-base font-semibold text-foreground md:inline md:text-xl">
                Maparium
              </span>
            </Link>

            {/* Utility buttons - visible on mobile */}
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
              {showShareButton ? (
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
              ) : null}
              <Button
                variant={pathname === "/about" ? "secondary" : "ghost"}
                size="icon"
                asChild
              >
                <Link
                  to="/about"
                  aria-label="About Maparium"
                  onClick={handleAboutClick}
                >
                  <Info className="h-4 w-4" />
                  <span className="sr-only">About</span>
                </Link>
              </Button>
              <Button
                variant={isPrivacyRoute ? "secondary" : "ghost"}
                size="icon"
                asChild
              >
                <Link
                  to="/privacy"
                  aria-label="Privacy policy"
                  onClick={handlePrivacyClick}
                >
                  <Shield className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://github.com/matymm347/maparium"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open GitHub repository"
                >
                  <img
                    src={githubInvertocatWhite}
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-4 invert opacity-70 transition-opacity hover:opacity-100 dark:invert-0"
                  />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
            </div>
          </div>

          {showSearch ? (
            <div className="w-full min-w-0 md:order-3 md:basis-full md:ml-0 md:mr-0 lg:order-0 lg:basis-auto lg:ml-4 lg:mr-auto lg:w-88 lg:max-w-[44vw] xl:w-104">
              <AddressSearch apiKey={apiKey} mapController={mapController} />
            </div>
          ) : (
            <div className="hidden md:block md:flex-1" aria-hidden="true" />
          )}

          {/* Utility buttons - hidden on mobile, visible on desktop */}
          <div className="hidden shrink-0 md:ml-auto md:flex md:flex-wrap md:justify-end md:gap-2 lg:flex-nowrap">
            <Button
              variant="outline"
              size="sm"
              onClick={onThemeToggle}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4 text-amber-500" />
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-slate-700" />
                </>
              )}
            </Button>
            {showShareButton ? (
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
            ) : null}
            <Button
              variant={pathname === "/about" ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/about" onClick={handleAboutClick}>
                {pathname === "/about" ? (
                  <CircleDot className="h-4 w-4" />
                ) : (
                  <Info className="h-4 w-4" />
                )}
                <span>About</span>
              </Link>
            </Button>
            <Button
              variant={isPrivacyRoute ? "secondary" : "ghost"}
              size="icon"
              asChild
            >
              <Link
                to="/privacy"
                aria-label="Privacy policy"
                onClick={handlePrivacyClick}
              >
                <Shield className="h-4 w-4" />
                <span className="sr-only">Privacy</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a
                href="https://github.com/matymm347/maparium"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open GitHub repository"
              >
                <img
                  src={githubInvertocatWhite}
                  alt=""
                  aria-hidden="true"
                  className="h-4 w-4 invert opacity-70 transition-opacity hover:opacity-100 dark:invert-0"
                />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
          </div>
        </div>
      </nav>

      {visibleLegendEntries.length > 0 ? (
        <div className="relative z-10 flex w-full flex-wrap justify-center gap-2 px-1">
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
