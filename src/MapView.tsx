import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";

const tileServerAddress = import.meta.env.VITE_TILE_SERVER_ADDRESS;

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

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

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
        id: "custom-layer",
        type: "fill",
        source: "custom-vector",
        "source-layer": "obszar_zagrozenia_powodziowego_1",
        paint: {
          "fill-color": "rgba(0, 120, 255, 0.4)",
          "fill-outline-color": "#0078ff",
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
