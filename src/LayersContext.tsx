import { createContext } from "react";

type FloodLayer = {
  active: boolean;
  name: string;
  layerName: string;
  color: string;
};

type Layers = {
  flood: Record<string, FloodLayer>;
};

export const LayersContext = createContext<{ layers: Layers }>({
  layers: { flood: {} },
});
