import { useState } from "react";
import { DropletOff, Waves } from "lucide-react";
import { Button } from "./components/ui/button";
import { cn } from "@/lib/utils";

export default function LayerSelection({
  layers,
  handleLayerVisibilityChange,
}) {
  const [activeButton, setActiveButton] = useState("flood");

  const toggleButton = (buttonId) => {
    setActiveButton((prev) => (prev === buttonId ? null : buttonId));
  };

  const isActive = (buttonId) => activeButton === buttonId;

  // Filter layers based on active button
  const getFilteredLayers = () => {
    if (!activeButton) return layers;

    if (activeButton === "drought") {
      // Show only drought layers
      return { drought: layers.drought };
    } else if (activeButton === "flood") {
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
            variant={isActive("drought") ? "default" : "outline"}
            size="icon"
            className={cn(
              "w-[50px] h-[50px] transition-all duration-200",
              isActive("drought") &&
                "bg-red-500 hover:bg-red-600 border-red-500"
            )}
            onClick={() => toggleButton("drought")}
          >
            <DropletOff
              className={cn("w-5 h-5", isActive("drought") && "fill-current")}
            />
          </Button>
          <p className="mt-2 text-center">Drought</p>
        </div>
        <div className="flex flex-col items-center">
          <Button
            variant={isActive("flood") ? "default" : "outline"}
            size="icon"
            className={cn(
              "w-[50px] h-[50px] transition-all duration-200",
              isActive("flood") &&
                "bg-blue-500 hover:bg-blue-600 border-blue-500"
            )}
            onClick={() => toggleButton("flood")}
          >
            <Waves
              className={cn("w-5 h-5", isActive("flood") && "fill-current")}
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
            const layer = groupLayers[key];
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
                    handleLayerVisibilityChange(group, key, !layer.visible)
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
