import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { Protocol } from "pmtiles";
import { useEffect, useRef, useState } from "react";
import { layers, namedFlavor } from "@protomaps/basemaps";
import LayerDrawer from "./LayerDrawer";
import LayerSelection from "./LayerSelection";
import { initialLayers } from "./initialLayers";

export type Layers = typeof initialLayers;
export type LayerGroup = keyof typeof initialLayers;
export type Layer<G extends LayerGroup> = keyof (typeof initialLayers)[G];

export default function MapView() {
  const [activeLayers, setActiveLayers] = useState<Layers>(initialLayers);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const isMapLoadedRef = useRef(false);

  // Get base URL for tiles based on environment
  const getTileUrl = (filename: string) => {
    if (import.meta.env.DEV) {
      return `pmtiles:///tiles/${filename}`;
    }
    // In production, use absolute URL or configure your server to serve these files
    return `pmtiles://https://maparium.pl/tiles/${filename}`;
  };

  function handleLayerVisibilityChange<T extends LayerGroup>(
    type: T,
    layer: Layer<T>,
    visible: boolean
  ) {
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

    const layerConfig = initialLayers[type][layer] as {
      visible: boolean;
      name: string;
      layerName: string;
      color: string;
    };
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

    // Register PMTiles protocol
    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);

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
            url: getTileUrl("poland_basemap_z13.pmtiles"),
            attribution:
              '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
          },
        },
        layers: layers("protomaps", namedFlavor("light"), { lang: "en" }),
      },
      // ceil to avoid blurry tiles on non integer ratios
      pixelRatio: Math.ceil(window.devicePixelRatio),
      center: [19.1451, 51.9194],
      zoom: 6,
    });

    map.addControl(new maplibregl.NavigationControl(), "bottom-right");
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "bottom-right"
    );

    map.on("load", () => {
      isMapLoadedRef.current = true;

      map.addSource("flood", {
        type: "vector",
        url: getTileUrl("flood.pmtiles"),
      });

      map.addSource("drought", {
        type: "vector",
        url: getTileUrl("drought.pmtiles"),
      });

      // radar testing
      map.addSource("radar", {
        type: "image",
        url: "https://maparium.pl/radarimages/sharp_radar_sharp_3600x3600.webp",
        coordinates: [
          [11.833929, 56.29577], // top-left
          [26.184176, 56.229947], // top-right
          [25.106189, 47.973201], // bottom-right
          [12.416322, 48.087229], // bottom-left
        ],
      });

      map.addLayer({
        id: "radar-layer",
        type: "raster",
        source: "radar",
        paint: {
          "raster-opacity": 0.7,
        },
      });

      mapRef.current = map;
    });

    return () => {
      maplibregl.removeProtocol("pmtiles");
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
        }}
      ></div>
    </div>
  );
}
