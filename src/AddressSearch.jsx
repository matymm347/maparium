import { Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

const MIN_QUERY_LENGTH = 3;
const SEARCH_DEBOUNCE_MS = 250;
const DEFAULT_FLY_TO_ZOOM = 12;

const formatSecondaryLabel = (feature) => {
  const context = Array.isArray(feature?.context) ? feature.context : [];
  const contextLabel = context
    .map((item) => item?.text)
    .filter(Boolean)
    .join(", ");

  if (contextLabel) {
    return contextLabel;
  }

  return feature?.place_name ?? "";
};

const buildSearchUrl = (query, apiKey) => {
  const params = new URLSearchParams({
    key: apiKey,
    autocomplete: "true",
    limit: "5",
    language: "en",
  });

  return `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?${params.toString()}`;
};

export default function AddressSearch({ apiKey, mapInstance }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const requestIdRef = useRef(0);
  const listboxId = useId();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!apiKey || !mapInstance || trimmedQuery.length < MIN_QUERY_LENGTH) {
      requestIdRef.current += 1;
      setResults([]);
      setStatus(trimmedQuery.length === 0 ? "idle" : "too-short");
      return undefined;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setStatus("loading");

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(buildSearchUrl(trimmedQuery, apiKey));
        if (!response.ok) {
          throw new Error("Geocoding request failed");
        }

        const payload = await response.json();
        if (requestId !== requestIdRef.current) {
          return;
        }

        const nextResults = Array.isArray(payload?.features)
          ? payload.features
          : [];
        setResults(nextResults);
        setStatus(nextResults.length > 0 ? "ready" : "empty");
        setIsOpen(true);
      } catch {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setResults([]);
        setStatus("error");
        setIsOpen(true);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [apiKey, mapInstance, query]);

  const handleSelect = (feature) => {
    const bbox = Array.isArray(feature?.bbox) ? feature.bbox : null;
    const center = Array.isArray(feature?.center) ? feature.center : null;

    if (bbox && bbox.length === 4) {
      mapInstance.fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
        { padding: 48, duration: 1200 },
      );
    } else if (center && center.length >= 2) {
      mapInstance.flyTo({
        center,
        zoom: Math.max(mapInstance.getZoom(), DEFAULT_FLY_TO_ZOOM),
        essential: true,
      });
    }

    setQuery(feature?.place_name ?? feature?.text ?? "");
    setIsOpen(false);
  };

  const clearSearch = () => {
    requestIdRef.current += 1;
    setQuery("");
    setResults([]);
    setStatus("idle");
    setIsOpen(false);
  };

  if (!apiKey || !mapInstance) {
    return null;
  }

  return (
    <div
      className="maparium-address-search relative w-full min-w-0 max-w-none"
      ref={wrapperRef}
    >
      <div className="input-group flex min-w-0 items-center gap-2 px-3">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            if (
              results.length > 0 ||
              status === "error" ||
              status === "empty"
            ) {
              setIsOpen(true);
            }
          }}
          placeholder="Search for a place"
          className="h-10 w-full bg-transparent text-sm outline-none"
          aria-label="Search for a place"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          autoComplete="off"
        />
        {query ? (
          <button
            type="button"
            onClick={clearSearch}
            className="clear-button-container flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-accent"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {isOpen || status === "loading" || status === "too-short" ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50">
          {status === "loading" ? (
            <div className="no-results px-4 py-3 text-sm">Searching…</div>
          ) : null}

          {status === "too-short" ? (
            <div className="no-results px-4 py-3 text-sm">
              Type at least {MIN_QUERY_LENGTH} characters.
            </div>
          ) : null}

          {status === "error" ? (
            <div className="error px-4 py-3 text-sm">
              Search is temporarily unavailable.
            </div>
          ) : null}

          {status === "empty" ? (
            <div className="no-results px-4 py-3 text-sm">No places found.</div>
          ) : null}

          {results.length > 0 ? (
            <ul
              id={listboxId}
              role="listbox"
              className="mt-2 overflow-hidden p-1"
            >
              {results.map((feature) => {
                const key = feature.id ?? feature.place_name ?? feature.text;

                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => handleSelect(feature)}
                      className="selected flex w-full flex-col items-start rounded-xl px-3 py-2 text-left transition-colors hover:bg-accent/60 focus:bg-accent/60 focus:outline-none"
                    >
                      <span className="primary text-sm font-medium">
                        {feature.place_name ?? feature.text ?? "Unnamed place"}
                      </span>
                      <span className="secondary text-xs">
                        {formatSecondaryLabel(feature)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
