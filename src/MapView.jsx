import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { layers, namedFlavor } from "@protomaps/basemaps";
import LayerDrawer from "./LayerDrawer";
import LayerSelection from "./LayerSelection";
import initialLayers from "./layers.json";
import { GeocodingControl } from "@maptiler/geocoding-control/react";
import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl-controller";
import "@maptiler/geocoding-control/style.css";

export default function MapView({ setApiKey, setMapController }) {
  const [layerConfig, setLayerConfig] = useState(
    buildLayerConfig(initialLayers),
  );

  const [API_KEY] = useState(import.meta.env.VITE_MAPTILER_API_KEY);
  47;
  const [chosenLayerGroup, setChosenLayerGroup] = useState([]);

  const mapRef = useRef(null);
  const isMapLoadedRef = useRef(false);

  // Get base URL for Martin server based on environment
  const getMartinUrl = () => {
    if (import.meta.env.DEV) {
      // In development, use VPS with HTTPS through nginx
      return "https://maparium.pl/tiles";
    }
    // In production, use absolute URL with current origin
    return `${window.location.origin}/tiles`;
  };

  function handleChooseLayerGroup(group) {
    setChosenLayerGroup(group);
    console.log("Chosen group in MapView:", group);
  }

  function buildLayerConfig(layersData) {
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
          visible: false,
          style: currentLayerData["style"],
          type: currentLayerData["type"],
          radius: currentLayerData["radius"],
        };
      }
    }
    return layerConfig;
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
    const layerSource = layerConfig[group]["layers"][layer]["fileName"];
    let layerSourceCut = layerSource;
    if (layerSource.endsWith(".mbtiles")) {
      layerSourceCut = layerSource.replace(".mbtiles", "");
    } else if (layerSource.endsWith(".pmtiles")) {
      layerSourceCut = layerSource.replace(".pmtiles", "");
    }
    const layerColor = layerConfig[group]["layers"][layer]["style"]["color"];
    const layerType = layerConfig[group]["layers"][layer]["type"];
    const layerRadius = layerConfig[group]["layers"][layer]["radius"];
    const martinUrl = getMartinUrl();
    const sourceName = `source_${layerId}`;

    // Remove existing layer and source if they exist
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getSource(sourceName)) {
      map.removeSource(sourceName);
    }

    if (!visible) {
      // Add source and layer only if making visible
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
      } else if (layerType === "circle") {
        map.addLayer({
          id: layerId,
          type: layerType,
          source: sourceName,
          "source-layer": layerSourceCut,
          paint: {
            "circle-radius": [
              "interpolate",
              ["exponential", 2],
              ["zoom"],
              0,
              layerRadius,
              6,
              2,
              10,
              4,
            ],
            "circle-color": layerColor,
            "circle-opacity": 0.9,
          },
        });
      }
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
            tiles: [`${martinUrl}/planet_z12/{z}/{x}/{y}`],
            minzoom: 0,
            maxzoom: 12,
            attribution:
              '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
          },
        },
        layers: layers("protomaps", namedFlavor("black"), { lang: "en" }),
      },
      // ceil to avoid blurry tiles on non integer ratios
      // pixelRatio: Math.ceil(window.devicePixelRatio),
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
      "bottom-right",
    );
    const controller = createMapLibreGlMapController(map, maplibregl);
    if (setApiKey) setApiKey(API_KEY);
    if (setMapController) setMapController(controller);

    map.on("style.load", () => {
      map.setProjection({
        type: "globe", // Set projection to globe
      });
    });

    map.on("load", () => {
      isMapLoadedRef.current = true;
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      // Clean up global variables
      if (typeof window !== "undefined") {
        window.mapariumApiKey = undefined;
        window.mapariumMapController = undefined;
      }
    };
  }, [API_KEY]);

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
          backgroundColor: "#1a1a1a",
        }}
      ></div>
    </div>
  );
}
