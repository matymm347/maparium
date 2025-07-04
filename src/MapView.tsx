import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import LayerDrawer from "./LayerDrawer";
import { LayersContext } from "./LayersContext";
import type { Layers } from "./LayersContext";

const tileServerAddress = import.meta.env.VITE_TILE_SERVER_ADDRESS;

const initialLayers: Layers = {
  flood: {
    probability_10: {
      active: false,
      name: "River flood hazard area (10%)",
      layerName: "obszar_zagrozenia_powodziowego_10",
      color: "#00C2FF",
    },
    probability_1: {
      active: false,
      name: "River flood hazard area (1%)",
      layerName: "obszar_zagrozenia_powodziowego_1",
      color: "#A259FF",
    },
    probability_02: {
      active: false,
      name: "River flood hazard area (0.2%)",
      layerName: "obszar_zagrozenia_powodziowego_02",
      color: "#FF3864",
    },
  },
};

export default function MapView() {
  const [layers, setLayers] = useState(initialLayers);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const isMapLoadedRef = useRef(false);

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
      zoom: 6.5,
      maxBounds: [
        [2, 45],
        [40.6132, 60],
      ],
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

  // Update map layers on `layers` change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoadedRef.current) return;

    // Add or remove layers
    Object.keys(initialLayers.flood).forEach((key) => {
      const layerId = initialLayers.flood[key].name;

      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }

      if (layers.flood[key].active) {
        map.addLayer({
          id: layerId,
          type: "fill",
          source: "custom-vector",
          "source-layer": layers.flood[key].layerName,
          paint: {
            "fill-color": layers.flood[key].color,
            "fill-opacity": 0.5,
          },
        });
      }
    });
  }, [layers]);

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
      }}
    >
      <LayersContext.Provider value={{ layers, setLayers }}>
        <LayerDrawer />
      </LayersContext.Provider>

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
