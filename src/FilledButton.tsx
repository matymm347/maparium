import { useState } from "react";
import { DropletOff, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function FilledButton() {
  const [activeButtons, setActiveButtons] = useState<Set<string>>(new Set());

  const toggleButton = (buttonId: string) => {
    const newActiveButtons = new Set(activeButtons);
    if (newActiveButtons.has(buttonId)) {
      newActiveButtons.delete(buttonId);
    } else {
      newActiveButtons.add(buttonId);
    }
    setActiveButtons(newActiveButtons);
  };

  const isActive = (buttonId: string) => activeButtons.has(buttonId);

  return (
    <div className="p-8 bg-background">
      <div className="flex flex-wrap gap-4 justify-center">
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
    </div>
  );
}
