import { useState, useContext } from "react";
import { DropletOff, Waves } from "lucide-react";
import { Button } from "./components/ui/button";
import { cn } from "@/lib/utils";
import { LayersContext } from "./LayersContext";

export default function LayerSelection() {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const toggleButton = (buttonId: string) => {
    setActiveButton((prev) => (prev === buttonId ? null : buttonId));
  };

  const isActive = (buttonId: string) => activeButton === buttonId;

  const { layers, setLayers } = useContext(LayersContext);

  const handleCheckboxChange = (key: string) => {
    setLayers((prev) => ({
      ...prev,
      flood: {
        ...prev.flood,
        [key]: {
          ...prev.flood[key],
          active: !prev.flood[key].active,
        },
      },
    }));
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
        {Object.keys(layers.flood).map((key) => {
          const layer = layers.flood[key];
          return (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="accent-current"
                checked={layer.active}
                onChange={() => handleCheckboxChange(key)}
              />
              <span>{layer.name}</span>
              <span
                className="inline-block w-4 h-4 rounded"
                style={{ backgroundColor: layer.color }}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
