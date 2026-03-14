import "maplibre-gl/dist/maplibre-gl.css";
import { Earth, Map as MapIcon } from "lucide-react";
import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { layers, namedFlavor } from "@protomaps/basemaps";
import LayerDrawer from "./LayerDrawer";
import LayerSelection from "./LayerSelection";
import initialLayers from "./layers.json";
import { GeocodingControl } from "@maptiler/geocoding-control/react";
import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl-controller";
import "@maptiler/geocoding-control/style.css";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const DEFAULT_MAP_VIEW = {
  center: [19.1451, 51.9194],
  zoom: 2,
  bearing: 0,
  pitch: 0,
};

const URL_PARAM_KEYS = {
  latitude: "lat",
  longitude: "lng",
  zoom: "z",
  bearing: "bearing",
  pitch: "pitch",
  layer: "layer",
};

const formatCoordinate = (value) => value.toFixed(5);
const formatZoom = (value) => value.toFixed(2);
const formatAngle = (value) => value.toFixed(1);
const PROTOMAPS_GLYPH_URL =
  "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf";

const getBasemapTheme = (theme) => (theme === "dark" ? "black" : "white");
const getSpriteTheme = (theme) => (theme === "dark" ? "dark" : "white");

const createBasemapStyle = (martinUrl, theme) => {
  const basemapTheme = getBasemapTheme(theme);
  const spriteTheme = getSpriteTheme(theme);

  return {
    version: 8,
    glyphs: PROTOMAPS_GLYPH_URL,
    sprite: `https://protomaps.github.io/basemaps-assets/sprites/v4/${spriteTheme}`,
    sources: {
      protomaps: {
        type: "vector",
        tiles: [`${martinUrl}/planet_z12/{z}/{x}/{y}`],
        minzoom: 0,
        maxzoom: 12,
        attribution:
          '<a href="https://maptiler.com/copyright?_gl=1*10ylx4k*_gcl_au*MjEwNDE3Mzk1LjE3NzI1NjkzNTI.*_ga*MjU0ODUyNi4xNzcyNTY5MzUz*_ga_K4SXYBF4HT*czE3NzI1NjkzNTIkbzEkZzEkdDE3NzI1Njk0NjAkajI1JGwwJGgw">© MapTiler |</a> <a href="https://protomaps.com">Protomaps |</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
      },
    },
    layers: layers("protomaps", namedFlavor(basemapTheme), { lang: "en" }),
  };
};

export default function MapView({
  setApiKey,
  setMapController,
  setLegendEntries,
  theme,
}) {
  const initialUrlStateRef = useRef(parseMapStateFromUrl(initialLayers));
  const [layerConfig, setLayerConfig] = useState(() =>
    buildLayerConfig(initialLayers, initialUrlStateRef.current.visibleLayerIds),
  );

  const [API_KEY] = useState(import.meta.env.VITE_MAP_TILER_API_KEY);
  const [chosenLayerGroup, setChosenLayerGroup] = useState(
    initialUrlStateRef.current.openGroups,
  );

  const mapRef = useRef(null);
  const isMapLoadedRef = useRef(false);
  const hoverPopupRef = useRef(null);
  const hoverHandlersRef = useRef(new Map());
  const interactiveLayerIdsRef = useRef(new Set());
  const layerConfigRef = useRef(layerConfig);
  const imageRequestIdRef = useRef(0);
  const [isFeatureSheetOpen, setIsFeatureSheetOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureImageUrl, setFeatureImageUrl] = useState(null);
  const [isFeatureImageLoading, setIsFeatureImageLoading] = useState(false);

  // Get base URL for Martin server based on environment
  const getMartinUrl = () => {
    if (import.meta.env.DEV) {
      // In development, use VPS with HTTPS through nginx
      return "https://maparium.pl/tiles";
    }
    // In production, use absolute URL with current origin
    return `${window.location.origin}/tiles`;
  };

  const getSourceName = (layerId) => `source_${layerId}`;
  const getHaloLayerId = (layerId) => `${layerId}__halo`;

  function buildLayerConfig(layersData, visibleLayerIds = new Set()) {
    const layerConfig = {};
    for (const group in layersData) {
      layerConfig[group] = {};
      layerConfig[group].lucideIcon = layersData[group]["lucideIcon"];
      layerConfig[group].layers = {};

      for (const layer in layersData[group]) {
        // Loop only for layers, skip additional group specifig entries
        if (
          layer == "folder_name" ||
          layer == "osmium filter" ||
          layer == "lucideIcon"
        ) {
          continue;
        }

        const currentLayerData = layersData[group][layer];

        let postprocessing = false;
        if (currentLayerData["postprocessing"]) {
          postprocessing = true;
        }

        layerConfig[group].layers[layer] = {
          fileName: currentLayerData["fileName"],
          description: currentLayerData["description"],
          postprocessing: postprocessing,
          visible: visibleLayerIds.has(layer),
          style: currentLayerData["style"],
          type: currentLayerData["type"],
          radius: currentLayerData["radius"],
        };
      }
    }
    return layerConfig;
  }

  function parseMapStateFromUrl(layersData) {
    const params = new URLSearchParams(window.location.search);
    const visibleLayerIds = new Set(params.getAll(URL_PARAM_KEYS.layer));
    const openGroups = Object.keys(layersData).filter((group) =>
      Object.keys(layersData[group]).some((layerName) => {
        if (
          layerName === "folder_name" ||
          layerName === "osmium filter" ||
          layerName === "lucideIcon"
        ) {
          return false;
        }

        return visibleLayerIds.has(layerName);
      }),
    );

    const parseNumber = (key, fallback) => {
      const rawValue = params.get(key);
      if (rawValue === null) {
        return fallback;
      }

      const parsedValue = Number(rawValue);
      return Number.isFinite(parsedValue) ? parsedValue : fallback;
    };

    return {
      center: [
        parseNumber(URL_PARAM_KEYS.longitude, DEFAULT_MAP_VIEW.center[0]),
        parseNumber(URL_PARAM_KEYS.latitude, DEFAULT_MAP_VIEW.center[1]),
      ],
      zoom: parseNumber(URL_PARAM_KEYS.zoom, DEFAULT_MAP_VIEW.zoom),
      bearing: parseNumber(URL_PARAM_KEYS.bearing, DEFAULT_MAP_VIEW.bearing),
      pitch: parseNumber(URL_PARAM_KEYS.pitch, DEFAULT_MAP_VIEW.pitch),
      visibleLayerIds,
      openGroups,
    };
  }

  const getVisibleLayerIds = (currentLayerConfig) =>
    Object.values(currentLayerConfig).flatMap((groupConfig) =>
      Object.entries(groupConfig.layers)
        .filter(([, layer]) => layer.visible)
        .map(([layerName]) => layerName),
    );

  const syncUrlWithMapState = (map, currentLayerConfig) => {
    const url = new URL(window.location.href);
    const center = map.getCenter();

    url.searchParams.set(URL_PARAM_KEYS.latitude, formatCoordinate(center.lat));
    url.searchParams.set(
      URL_PARAM_KEYS.longitude,
      formatCoordinate(center.lng),
    );
    url.searchParams.set(URL_PARAM_KEYS.zoom, formatZoom(map.getZoom()));
    url.searchParams.set(URL_PARAM_KEYS.bearing, formatAngle(map.getBearing()));
    url.searchParams.set(URL_PARAM_KEYS.pitch, formatAngle(map.getPitch()));
    url.searchParams.delete(URL_PARAM_KEYS.layer);

    getVisibleLayerIds(currentLayerConfig)
      .sort((left, right) => left.localeCompare(right))
      .forEach((layerId) => {
        url.searchParams.append(URL_PARAM_KEYS.layer, layerId);
      });

    const nextUrl = `${url.pathname}${url.search}${url.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (nextUrl !== currentUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  };

  const addMapLayerSet = (map, layerId, layerDefinition) => {
    const layerSource = layerDefinition.fileName;
    let layerSourceCut = layerSource;

    if (layerSource.endsWith(".mbtiles")) {
      layerSourceCut = layerSource.replace(".mbtiles", "");
    } else if (layerSource.endsWith(".pmtiles")) {
      layerSourceCut = layerSource.replace(".pmtiles", "");
    }

    const layerColor = layerDefinition.style.color;
    const layerType = layerDefinition.type;
    const layerRadius = layerDefinition.radius;
    const martinUrl = getMartinUrl();
    const sourceName = getSourceName(layerId);
    const haloLayerId = getHaloLayerId(layerId);

    map.addSource(sourceName, {
      type: "vector",
      tiles: [`${martinUrl}/${layerSourceCut}/{z}/{x}/{y}`],
      minzoom: 0,
      maxzoom: 12,
    });

    if (layerType === "line") {
      map.addLayer({
        id: layerId,
        type: layerType,
        source: sourceName,
        "source-layer": layerSourceCut,
        paint: {
          "line-color": layerColor,
          "line-width": 2,
          "line-opacity": 0.8,
        },
      });
      return;
    }

    if (layerType === "circle") {
      map.addLayer({
        id: haloLayerId,
        type: layerType,
        source: sourceName,
        "source-layer": layerSourceCut,
        paint: {
          "circle-radius": getCircleRadiusExpression(layerRadius, 6),
          "circle-color": layerColor,
          "circle-opacity": 0,
        },
      });

      map.addLayer({
        id: layerId,
        type: layerType,
        source: sourceName,
        "source-layer": layerSourceCut,
        paint: {
          "circle-radius": getCircleRadiusExpression(layerRadius),
          "circle-color": layerColor,
          "circle-opacity": 0.9,
        },
      });

      registerHoverHandlers(map, haloLayerId);
    }
  };

  const applyVisibleLayersToMap = (map, currentLayerConfig) => {
    Object.values(currentLayerConfig).forEach((groupConfig) => {
      Object.entries(groupConfig.layers).forEach(
        ([layerId, layerDefinition]) => {
          removeMapLayerSet(map, layerId);

          if (layerDefinition.visible) {
            addMapLayerSet(map, layerId, layerDefinition);
          }
        },
      );
    });
  };

  const getCircleRadiusExpression = (baseRadius, haloSize = 0) => [
    "interpolate",
    ["exponential", 2],
    ["zoom"],
    0,
    baseRadius + haloSize,
    6,
    2 + haloSize,
    10,
    4 + haloSize,
  ];

  const getFeatureName = (feature) => {
    const name = feature?.properties?.name;
    if (typeof name !== "string") {
      return null;
    }

    const trimmedName = name.trim();
    return trimmedName.length > 0 ? trimmedName : null;
  };

  const hideHoverPopup = () => {
    hoverPopupRef.current?.remove();
  };

  const getFeatureProperty = (feature, key) => {
    const properties = feature?.properties;
    if (!properties || typeof properties !== "object") {
      return null;
    }

    const directValue = properties[key];
    if (typeof directValue === "string") {
      const trimmedDirectValue = directValue.trim();
      return trimmedDirectValue.length > 0 ? trimmedDirectValue : null;
    }

    const keyLowercase = key.toLowerCase();
    const matchedKey = Object.keys(properties).find(
      (propertyKey) => propertyKey.toLowerCase() === keyLowercase,
    );

    if (!matchedKey || typeof properties[matchedKey] !== "string") {
      return null;
    }

    const trimmedValue = properties[matchedKey].trim();
    return trimmedValue.length > 0 ? trimmedValue : null;
  };

  const normalizeWikidataId = (rawWikidata) => {
    if (!rawWikidata) {
      return null;
    }

    const wikidataMatch = rawWikidata.match(/(Q\d+)/i);
    if (!wikidataMatch) {
      return null;
    }

    return wikidataMatch[1].toUpperCase();
  };

  const buildWikipediaUrl = (rawWikipediaTag) => {
    if (!rawWikipediaTag) {
      return null;
    }

    if (/^https?:\/\//i.test(rawWikipediaTag)) {
      return rawWikipediaTag;
    }

    const tagWithoutPrefix = rawWikipediaTag.replace(/^wikipedia\s*:\s*/i, "");
    const separatorIndex = tagWithoutPrefix.indexOf(":");

    if (separatorIndex < 0) {
      return `https://en.wikipedia.org/wiki/${encodeURIComponent(tagWithoutPrefix)}`;
    }

    const languageCode =
      tagWithoutPrefix.slice(0, separatorIndex).trim() || "en";
    const articleName = tagWithoutPrefix.slice(separatorIndex + 1).trim();

    if (!articleName) {
      return null;
    }

    return `https://${languageCode}.wikipedia.org/wiki/${encodeURIComponent(articleName)}`;
  };

  const getFeatureSheetData = (feature) => {
    const rawWikidata = getFeatureProperty(feature, "wikidata");
    const rawWikipedia = getFeatureProperty(feature, "wikipedia");

    return {
      name: getFeatureName(feature) ?? "Unnamed feature",
      wikidataId: normalizeWikidataId(rawWikidata),
      wikipediaUrl: buildWikipediaUrl(rawWikipedia),
    };
  };

  const fetchFeatureImage = async (wikidataId, requestId) => {
    if (!wikidataId) {
      setFeatureImageUrl(null);
      setIsFeatureImageLoading(false);
      return;
    }

    setIsFeatureImageLoading(true);

    try {
      const endpoint = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wikidataId}&props=claims&format=json&origin=*`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Failed to load Wikidata entity");
      }

      const payload = await response.json();
      const imageFileName =
        payload?.entities?.[wikidataId]?.claims?.P18?.[0]?.mainsnak?.datavalue
          ?.value;

      if (requestId !== imageRequestIdRef.current) {
        return;
      }

      if (!imageFileName) {
        setFeatureImageUrl(null);
        return;
      }

      setFeatureImageUrl(
        `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(imageFileName)}?width=960`,
      );
    } catch {
      if (requestId !== imageRequestIdRef.current) {
        return;
      }
      setFeatureImageUrl(null);
    } finally {
      if (requestId === imageRequestIdRef.current) {
        setIsFeatureImageLoading(false);
      }
    }
  };

  const getFeaturePopupLabel = (feature) =>
    getFeatureName(feature) ?? "unnamed";

  const findNearbyFeature = (map, point) => {
    const interactiveLayerIds = Array.from(interactiveLayerIdsRef.current);
    if (interactiveLayerIds.length === 0) {
      return null;
    }

    const hoverPadding = 10;
    const features = map.queryRenderedFeatures(
      [
        [point.x - hoverPadding, point.y - hoverPadding],
        [point.x + hoverPadding, point.y + hoverPadding],
      ],
      { layers: interactiveLayerIds },
    );

    return (
      features.find((feature) => getFeatureName(feature)) ?? features[0] ?? null
    );
  };

  const registerHoverHandlers = (map, layerId) => {
    if (hoverHandlersRef.current.has(layerId)) {
      return;
    }

    interactiveLayerIdsRef.current.add(layerId);

    const handleMouseEnter = () => {};

    const handleMouseMove = (event) => {
      const feature = findNearbyFeature(map, event.point);

      if (!feature) {
        hideHoverPopup();
        return;
      }

      hoverPopupRef.current
        ?.setLngLat(event.lngLat)
        .setText(getFeaturePopupLabel(feature))
        .addTo(map);
    };

    const handleMouseLeave = () => {
      hideHoverPopup();
    };

    map.on("mouseenter", layerId, handleMouseEnter);
    map.on("mousemove", layerId, handleMouseMove);
    map.on("mouseleave", layerId, handleMouseLeave);

    hoverHandlersRef.current.set(layerId, {
      handleMouseEnter,
      handleMouseMove,
      handleMouseLeave,
    });
  };

  const unregisterHoverHandlers = (map, layerId) => {
    const hoverHandlers = hoverHandlersRef.current.get(layerId);
    if (!hoverHandlers) {
      interactiveLayerIdsRef.current.delete(layerId);
      return;
    }

    map.off("mouseenter", layerId, hoverHandlers.handleMouseEnter);
    map.off("mousemove", layerId, hoverHandlers.handleMouseMove);
    map.off("mouseleave", layerId, hoverHandlers.handleMouseLeave);
    hoverHandlersRef.current.delete(layerId);
    interactiveLayerIdsRef.current.delete(layerId);

    if (interactiveLayerIdsRef.current.size === 0) {
      hideHoverPopup();
    }
  };

  const removeMapLayerSet = (map, layerId) => {
    const haloLayerId = getHaloLayerId(layerId);
    const sourceName = getSourceName(layerId);

    unregisterHoverHandlers(map, haloLayerId);

    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getLayer(haloLayerId)) {
      map.removeLayer(haloLayerId);
    }
    if (map.getSource(sourceName)) {
      map.removeSource(sourceName);
    }
  };

  function handleChooseLayerGroup(group) {
    setChosenLayerGroup(group);
  }

  function clearAllLayers(layerConfig) {
    // Create a deep copy of layerConfig with all layers set to visible: false
    const newConfig = {};
    Object.keys(layerConfig).forEach((group) => {
      newConfig[group] = {
        ...layerConfig[group],
        layers: {},
      };
      Object.keys(layerConfig[group]["layers"]).forEach((layer) => {
        newConfig[group].layers[layer] = {
          ...layerConfig[group]["layers"][layer],
          visible: false,
        };
      });
    });
    setLayerConfig(newConfig);

    // Remove all layers from the map
    const map = mapRef.current;
    if (map && isMapLoadedRef.current) {
      Object.keys(layerConfig).forEach((group) => {
        Object.keys(layerConfig[group]["layers"]).forEach((layer) => {
          removeMapLayerSet(map, layer);
        });
      });
    }
  }

  function updateLayerVisibility(layerConfig, group, layer) {
    const visible = layerConfig[group]["layers"][layer]["visible"];

    const updatedLayerConfig = {
      ...layerConfig,
      [group]: {
        ...layerConfig[group],
        layers: {
          ...layerConfig[group]["layers"],
          [layer]: {
            ...layerConfig[group]["layers"][layer],
            visible: !visible,
          },
        },
      },
    };

    setLayerConfig(updatedLayerConfig);

    // Update map layers
    const map = mapRef.current;
    if (!map || !isMapLoadedRef.current) return;

    const layerId = layer;
    const updatedLayer = updatedLayerConfig[group]["layers"][layer];

    // Remove existing layer and source if they exist
    removeMapLayerSet(map, layerId);

    if (!visible) {
      addMapLayerSet(map, layerId, updatedLayer);
    }
  }

  useEffect(() => {
    const wikidataId = selectedFeature?.wikidataId;
    const requestId = imageRequestIdRef.current + 1;
    imageRequestIdRef.current = requestId;

    fetchFeatureImage(wikidataId, requestId);
  }, [selectedFeature]);

  useEffect(() => {
    layerConfigRef.current = layerConfig;

    const map = mapRef.current;
    if (!map || !isMapLoadedRef.current) {
      return;
    }

    syncUrlWithMapState(map, layerConfig);
  }, [layerConfig]);

  useEffect(() => {
    if (!setLegendEntries) {
      return;
    }

    const activeEntries = Object.entries(layerConfig).flatMap(
      ([group, groupConfig]) =>
        Object.entries(groupConfig.layers)
          .filter(([, layer]) => layer.visible)
          .map(([layerName, layer]) => ({
            id: `${group}-${layerName}`,
            label: layerName,
            color: layer.style.color,
          })),
    );

    setLegendEntries(activeEntries);
  }, [layerConfig, setLegendEntries]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoadedRef.current) {
      return;
    }

    const martinUrl = getMartinUrl();
    const currentCenter = map.getCenter();
    const mapViewSnapshot = {
      center: [currentCenter.lng, currentCenter.lat],
      zoom: map.getZoom(),
      bearing: map.getBearing(),
      pitch: map.getPitch(),
    };

    map.once("style.load", () => {
      if (!mapRef.current) {
        return;
      }

      map.jumpTo(mapViewSnapshot);
    });

    map.setStyle(createBasemapStyle(martinUrl, theme));
  }, [theme]);

  // Initialize the map
  useEffect(() => {
    if (mapRef.current) return;

    const martinUrl = getMartinUrl();

    const map = new maplibregl.Map({
      container: "map-view",
      style: createBasemapStyle(martinUrl, theme),
      center: initialUrlStateRef.current.center,
      zoom: initialUrlStateRef.current.zoom,
      bearing: initialUrlStateRef.current.bearing,
      pitch: initialUrlStateRef.current.pitch,
    });

    // Store map reference immediately to prevent duplicate instances
    mapRef.current = map;
    map.getCanvas().style.cursor = "default";
    hoverPopupRef.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 12,
    });

    map.addControl(new maplibregl.NavigationControl(), "bottom-right");
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "bottom-right",
    );

    if (maplibregl.ProjectionControl) {
      map.addControl(
        new maplibregl.ProjectionControl({
          projections: [
            { name: "Globe", id: "globe" },
            { name: "Mercator", id: "mercator" },
          ],
        }),
        "bottom-right",
      );
    }

    if (maplibregl.GlobeControl) {
      map.addControl(new maplibregl.GlobeControl(), "bottom-right");
    }
    const controller = createMapLibreGlMapController(map, maplibregl);
    if (setApiKey) setApiKey(API_KEY);
    if (setMapController) setMapController(controller);

    map.on("style.load", () => {
      map.setProjection({
        type: "globe",
      });

      if (isMapLoadedRef.current) {
        applyVisibleLayersToMap(map, layerConfigRef.current);
      }
    });

    map.on("load", () => {
      isMapLoadedRef.current = true;
      applyVisibleLayersToMap(map, layerConfigRef.current);
      syncUrlWithMapState(map, layerConfigRef.current);
    });

    const handleMapViewChange = () => {
      if (!isMapLoadedRef.current) {
        return;
      }

      syncUrlWithMapState(map, layerConfigRef.current);
    };

    const handleMapClick = (event) => {
      const clickedFeature = findNearbyFeature(map, event.point);
      if (!clickedFeature) {
        return;
      }

      setSelectedFeature(getFeatureSheetData(clickedFeature));
      setIsFeatureSheetOpen(true);
      hideHoverPopup();
    };

    map.on("moveend", handleMapViewChange);
    map.on("rotateend", handleMapViewChange);
    map.on("pitchend", handleMapViewChange);
    map.on("click", handleMapClick);

    return () => {
      map.off("moveend", handleMapViewChange);
      map.off("rotateend", handleMapViewChange);
      map.off("pitchend", handleMapViewChange);
      map.off("click", handleMapClick);
      hoverPopupRef.current?.remove();
      hoverPopupRef.current = null;
      hoverHandlersRef.current.clear();
      interactiveLayerIdsRef.current.clear();

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [API_KEY, theme]);

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
      }}
    >
      <LayerDrawer>
        <LayerSelection
          layerConfig={layerConfig}
          updateLayerVisibility={updateLayerVisibility}
          chosenLayerGroup={chosenLayerGroup}
          handleChooseLayerGroup={handleChooseLayerGroup}
          clearAllLayers={clearAllLayers}
        />
      </LayerDrawer>
      <Sheet open={isFeatureSheetOpen} onOpenChange={setIsFeatureSheetOpen}>
        <SheetContent side="right" className="w-[90vw] p-0 sm:max-w-md">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <SheetHeader>
                <SheetTitle>
                  {selectedFeature?.name ?? "Feature details"}
                </SheetTitle>
                <SheetDescription>
                  Wikipedia and Wikidata information for selected map feature.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {isFeatureImageLoading ? (
                  <div className="bg-muted h-52 w-full animate-pulse rounded-md" />
                ) : featureImageUrl ? (
                  <img
                    src={featureImageUrl}
                    alt={selectedFeature?.name ?? "Feature"}
                    className="h-auto w-full rounded-md border object-cover"
                    loading="lazy"
                    onError={() => setFeatureImageUrl(null)}
                  />
                ) : (
                  <div className="bg-muted/40 text-muted-foreground rounded-md border p-3 text-sm">
                    No image available for this feature.
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Wikidata:</span>{" "}
                    {selectedFeature?.wikidataId ?? "Not available"}
                  </p>
                  {selectedFeature?.wikipediaUrl ? (
                    <a
                      href={selectedFeature.wikipediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-700 hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200 inline-flex items-center gap-1 font-medium underline underline-offset-4"
                    >
                      Open Wikipedia article
                    </a>
                  ) : (
                    <p className="text-muted-foreground">
                      Wikipedia link not available.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="text-muted-foreground border-border border-t px-6 py-4 text-xs leading-relaxed">
              <p>
                Data from{" "}
                <a
                  href="https://www.wikidata.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-700 hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200 underline underline-offset-4"
                >
                  Wikidata
                </a>{" "}
                and{" "}
                <a
                  href="https://www.wikipedia.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-700 hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200 underline underline-offset-4"
                >
                  Wikipedia
                </a>
                . Images from{" "}
                <a
                  href="https://commons.wikimedia.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-700 hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200 underline underline-offset-4"
                >
                  Wikimedia Commons
                </a>
                .
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div
        id="map-view"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          backgroundColor: theme === "dark" ? "#1a1a1a" : "#edf2f7",
        }}
      ></div>
    </div>
  );
}
