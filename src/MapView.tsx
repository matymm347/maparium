import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";
import LayerDrawer from "./LayerDrawer";
import { LayersContext } from "./LayersContext";

const tileServerAddress = import.meta.env.VITE_TILE_SERVER_ADDRESS;

const layers = {
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

function Map() {
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: "map-view",
      style: `https://${tileServerAddress}/tiles/styles/basic/style.json`,
      transformRequest: (url) => {
        if (url.startsWith("/tiles/")) {
          return {
            url: `https://${tileServerAddress}${url}`,
          };
        }
        return { url };
      },
      center: [19.1451, 51.9194],
      zoom: 6.5,
      maxBounds: [
        [2, 45], // Southwest coordinates
        [40.6132, 60], // Northeast coordinates
      ],
    });

    map.current.addControl(new maplibregl.NavigationControl(), "bottom-right");

    map.current.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
      "bottom-right"
    );

    map.current.on("load", () => {
      map.current?.addSource("custom-vector", {
        type: "vector",
        tiles: [
          `https://${tileServerAddress}/tiles/data/flood/{z}/{x}/{y}.pbf`,
        ],
        minzoom: 0,
        maxzoom: 14,
      });

      map.current?.addLayer({
        id: "obszar_zagrozenia_powodziowego_10",
        type: "fill",
        source: "custom-vector",
        "source-layer": "obszar_zagrozenia_powodziowego_10",
        paint: {
          "fill-color": "#00C2FF",
          "fill-opacity": 0.5,
        },
      });
    });
  }, []);

  return null;
}

export default function MapView() {
  return (
    <>
      <div
        style={{
          position: "relative",
          height: "100vh",
          width: "100vw",
        }}
      >
        <LayersContext.Provider value={{ layers }}>
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
      <Map />
    </>
  );
}
