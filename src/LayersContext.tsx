import { createContext } from "react";

type FloodLayer = {
  active: boolean;
  name: string;
  layerName: string;
  color: string;
};

export type Layers = {
  flood: Record<string, FloodLayer>;
};

type LayersContextType = {
  layers: Layers;
  setLayers: React.Dispatch<React.SetStateAction<Layers>>;
};

export const LayersContext = createContext<LayersContextType>({
  layers: { flood: {} },
  setLayers: () => {},
});
