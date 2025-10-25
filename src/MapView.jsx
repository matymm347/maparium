import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { layers, namedFlavor } from "@protomaps/basemaps";
import LayerDrawer from "./LayerDrawer";
import LayerSelection from "./LayerSelection";
import { initialLayers } from "./initialLayers";

export default function MapView() {
  const [activeLayers, setActiveLayers] = useState(initialLayers);
  const mapRef = useRef(null);
  const isMapLoadedRef = useRef(false);

  // Get base URL for Martin server based on environment
  const getMartinUrl = () => {
    if (import.meta.env.DEV) {
      // In development, use VPS with HTTPS through nginx
      return "https://maparium.pl/tiles";
    }
    // In production, use relative path (same domain)
    return "/tiles";
  };

  function handleLayerVisibilityChange(type, layer, visible) {
    setActiveLayers((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [layer]: {
          ...prev[type][layer],
          visible,
        },
      },
    }));

    // Update map layers immediately
    const map = mapRef.current;
    if (!map || !isMapLoadedRef.current) return;

    const layerConfig = initialLayers[type][layer];
    const layerId = layerConfig.name;

    // Remove existing layer if it exists
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }

    // Add flood layer if it should be visible
    if (type === "flood" && visible) {
      map.addLayer({
        id: layerId,
        type: "fill",
        source: type,
        "source-layer": layerConfig.layerName,
        paint: {
          "fill-color": layerConfig.color,
          "fill-opacity": 0.5,
        },
      });
    }

    if (type === "drought" && visible) {
      map.addLayer({
        id: layerId,
        type: "fill",
        source: type,
        "source-layer": layerConfig.layerName,
        paint: {
          "fill-color": [
            "case",
            ["==", ["get", "class"], 1], // (lowest risk)
            "#A8E6A1",
            ["==", ["get", "class"], 2],
            "#FFF59D",
            ["==", ["get", "class"], 3],
            "#FFCC80",
            ["==", ["get", "class"], 4], // (highest risk)
            "#FF9E9E",
            "#CCCCCC", // unknown values
          ],
          "fill-opacity": 0.5,
          "fill-outline-color": "transparent",
        },
      });
    }
  }

  // Initialize the map
  useEffect(() => {
    if (mapRef.current) return;

    const martinUrl = getMartinUrl();

    const map = new maplibregl.Map({
      container: "map-view",
      style: {
        version: 8,
        glyphs:
          "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
        sprite: "https://protomaps.github.io/basemaps-assets/sprites/v4/light",
        sources: {
          protomaps: {
            type: "vector",
            tiles: [`${martinUrl}/planet_z9/{z}/{x}/{y}`],
            minzoom: 0,
            maxzoom: 14,
            attribution:
              '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
          },
        },
        layers: layers("protomaps", namedFlavor("white"), { lang: "en" }),
      },
      // ceil to avoid blurry tiles on non integer ratios
      pixelRatio: Math.ceil(window.devicePixelRatio),
      center: [19.1451, 51.9194],
      zoom: 2,
    });

    // Store map reference immediately to prevent duplicate instances
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), "bottom-right");
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "bottom-right"
    );

    map.on("style.load", () => {
      map.setProjection({
        type: "globe", // Set projection to globe
      });
    });

    map.on("load", () => {
      isMapLoadedRef.current = true;

      map.addSource("flood", {
        type: "vector",
        tiles: [`${martinUrl}/flood/{z}/{x}/{y}`],
        minzoom: 0,
        maxzoom: 14,
      });

      map.addSource("drought", {
        type: "vector",
        tiles: [`${martinUrl}/drought/{z}/{x}/{y}`],
        minzoom: 0,
        maxzoom: 14,
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

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
          layers={activeLayers}
          handleLayerVisibilityChange={handleLayerVisibilityChange}
        />
      </LayerDrawer>
      <div
        id="map-view"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#f3f4f6",
        }}
      ></div>
    </div>
  );
}
