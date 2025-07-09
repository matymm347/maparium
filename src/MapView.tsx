import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import LayerDrawer from "./LayerDrawer";
import LayerSelection from "./LayerSelection";
import { layers } from "./layers";

const tileServerAddress = import.meta.env.VITE_TILE_SERVER_ADDRESS;

const initialLayers = layers;

export type Layers = typeof initialLayers;
export type LayerGroup = keyof typeof initialLayers;
export type Layer<G extends LayerGroup> = keyof (typeof initialLayers)[G];

export default function MapView() {
  const [layers, setLayers] = useState<Layers>(initialLayers);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const isMapLoadedRef = useRef(false);

  function handleLayerVisibilityChange(
    type: LayerGroup,
    layer: Layer<LayerGroup>,
    visible: boolean
  ) {
    setLayers((prev) => ({
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

    const map = new maplibregl.Map({
      container: "map-view",
      style: `https://${tileServerAddress}/tiles/styles/basic/style.json`,
      transformRequest: (url) => {
        if (url.startsWith("/tiles/")) {
          return { url: `https://${tileServerAddress}${url}` };
        }
        return { url };
      },
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
        tiles: [
          `https://${tileServerAddress}/tiles/data/flood/{z}/{x}/{y}.pbf`,
        ],
        minzoom: 0,
        maxzoom: 14,
      });

      mapRef.current = map;
    });
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
          layers={layers}
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
