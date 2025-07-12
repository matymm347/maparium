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

  function handleLayerVisibilityChange(
    type: LayerGroup,
    layer: Layer<LayerGroup>,
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

    const layerConfig = initialLayers[type][layer];
    const layerId = layerConfig.name;

    // Remove existing layer if it exists
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }

    // Add layer if it should be visible
    if (visible) {
      map.addLayer({
        id: layerId,
        type: "fill",
        source: "custom-vector",
        "source-layer": layerConfig.layerName,
        paint: {
          "fill-color": layerConfig.color,
          "fill-opacity": 0.5,
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
            url: "pmtiles:///tiles/poland_basemap.pmtiles",
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
      minZoom: 6,
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

      map.addSource("custom-vector", {
        type: "vector",
        url: `pmtiles:///tiles/flood.pmtiles`,
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
