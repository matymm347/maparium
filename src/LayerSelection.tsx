import { useState } from "react";
import { DropletOff, Waves } from "lucide-react";
import { Button } from "./components/ui/button";
import { cn } from "@/lib/utils";
import type { Layers, Layer, LayerGroup } from "./MapView";

type LayerSelectionProps = {
  layers: Layers;
  handleLayerVisibilityChange: <T extends LayerGroup>(
    type: T,
    layer: Layer<T>,
    visible: boolean
  ) => void;
};

export default function LayerSelection({
  layers,
  handleLayerVisibilityChange,
}: LayerSelectionProps) {
  const [activeButton, setActiveButton] = useState<string | null>("bookmark");

  const toggleButton = (buttonId: string) => {
    setActiveButton((prev) => (prev === buttonId ? null : buttonId));
  };

  const isActive = (buttonId: string) => activeButton === buttonId;

  // Filter layers based on active button
  const getFilteredLayers = () => {
    if (!activeButton) return layers;

    if (activeButton === "heart") {
      // Show only drought layers
      return { drought: layers.drought };
    } else if (activeButton === "bookmark") {
      // Show only flood layers
      return { flood: layers.flood };
    }

    return layers;
  };

  return (
    <div className="p-8 bg-background">
      {/* First row: group buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <div className="flex flex-col items-center">
          <Button
            variant={isActive("heart") ? "default" : "outline"}
            size="icon"
            className={cn(
              "w-[50px] h-[50px] transition-all duration-200",
              isActive("heart") && "bg-red-500 hover:bg-red-600 border-red-500"
            )}
            onClick={() => toggleButton("heart")}
          >
            <DropletOff
              className={cn("w-5 h-5", isActive("heart") && "fill-current")}
            />
          </Button>
          <p className="mt-2 text-center">Drought</p>
        </div>
        <div className="flex flex-col items-center">
          <Button
            variant={isActive("bookmark") ? "default" : "outline"}
            size="icon"
            className={cn(
              "w-[50px] h-[50px] transition-all duration-200",
              isActive("bookmark") &&
                "bg-blue-500 hover:bg-blue-600 border-blue-500"
            )}
            onClick={() => toggleButton("bookmark")}
          >
            <Waves
              className={cn("w-5 h-5", isActive("bookmark") && "fill-current")}
            />
          </Button>
          <p className="mt-2 text-center">Flood</p>
        </div>
      </div>
      {/* Second row: layers with checkboxes */}
      <div className="flex flex-col gap-3 items-center">
        {!activeButton && (
          <p className="text-muted-foreground text-center mb-4">
            Select a category above to view available layers
          </p>
        )}
        {Object.entries(getFilteredLayers()).map(([group, groupLayers]) =>
          Object.keys(groupLayers).map((key) => {
            const layer = groupLayers[key as keyof typeof groupLayers] as {
              visible: boolean;
              name: string;
              layerName: string;
              color: string;
            };
            return (
              <label
                key={group + key}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="accent-current"
                  checked={layer.visible}
                  onChange={() =>
                    handleLayerVisibilityChange(
                      group as LayerGroup,
                      key as Layer<LayerGroup>,
                      !layer.visible
                    )
                  }
                />
                <span>{layer.name}</span>
                <span
                  className="inline-block w-4 h-4 rounded"
                  style={{ backgroundColor: layer.color }}
                />
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}
