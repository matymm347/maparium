import "@maptiler/sdk/dist/maptiler-sdk.css";
import * as maptilersdk from "@maptiler/sdk";
import { useEffect, useRef } from "react";

maptilersdk.config.apiKey = import.meta.env.VITE_MAP_TILER_API_KEY;

function Map() {
  const map = useRef<maptilersdk.Map | null>(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new maptilersdk.Map({
      container: "map-view",
      style: maptilersdk.MapStyle.BASIC,
      center: [19.1451, 51.9194],
      zoom: 6.5,
      language: "pl",
    });

    map.current.on("load", () => {
      // Add a vector source from TileServer-GL
      map.current?.addSource("custom-vector", {
        type: "vector",
        tiles: ["http://192.168.100.88:8080/data/output/{z}/{x}/{y}.pbf"], // debug local stage server address
        minzoom: 0,
        maxzoom: 14,
      });

      // Add and style a layer
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
