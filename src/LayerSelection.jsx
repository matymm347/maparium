import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayerIconMap } from "./LayerIconMap";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";

export default function LayerSelection({
  layerConfig,
  updateLayerVisibility,
  chosenLayerGroup,
  isLayerLockEnabled,
  onToggleLayerLock,
  handleChooseLayerGroup,
  clearAllLayers,
}) {
  return (
    <>
      <div className="mb-4 ml-4 flex w-fit flex-col gap-2">
        <Button
          variant="destructive"
          className="w-fit px-2 py-1 text-xs text-red-700 bg-red-100 hover:bg-red-200 dark:bg-[#3B1C1D] dark:text-[#F66163] dark:hover:bg-[#512425]"
          onClick={() => clearAllLayers(layerConfig)}
        >
          Clear all
        </Button>
        <Button
          type="button"
          variant={isLayerLockEnabled ? "secondary" : "outline"}
          size="sm"
          className="w-fit justify-start gap-2"
          onClick={onToggleLayerLock}
          aria-pressed={isLayerLockEnabled}
          aria-label={
            isLayerLockEnabled
              ? "Unlock multiple layers"
              : "Lock to allow multiple layers"
          }
        >
          {isLayerLockEnabled ? (
            <>
              <Lock className="h-4 w-4" />
              <span>Multiple layers locked</span>
            </>
          ) : (
            <>
              <Unlock className="h-4 w-4" />
              <span>Single layer mode</span>
            </>
          )}
        </Button>
      </div>
      <Accordion
        type="single"
        collapsible
        value={chosenLayerGroup}
        onValueChange={handleChooseLayerGroup}
      >
        <div className="h-[80vh] w-full">
          <ScrollArea className="bg-card text-card-foreground border-border h-full w-full rounded-md border p-4">
            {Object.keys(layerConfig).map((group) => {
              const Icon = LayerIconMap[layerConfig[group]["lucideIcon"]];
              return (
                <AccordionItem value={group} key={group}>
                  <AccordionTrigger data-state="open">
                    <div className="flex">
                      <div className="flex items-center mr-2">
                        <Icon size={18} />
                      </div>
                      <div className="flex items-center">{group}</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="ml-8">
                    {Object.keys(layerConfig[group]["layers"]).map((layer) => {
                      return (
                        <div className="flex items-center" key={layer}>
                          <div className="mr-2 my-2">
                            <Checkbox
                              checked={
                                layerConfig[group]["layers"][layer]["visible"]
                              }
                              color={
                                layerConfig[group]["layers"][layer]["style"][
                                  "color"
                                ]
                              }
                              onCheckedChange={() =>
                                updateLayerVisibility(layerConfig, group, layer)
                              }
                            />
                          </div>
                          <p
                            onClick={() =>
                              updateLayerVisibility(layerConfig, group, layer)
                            }
                          >
                            {layer}
                          </p>
                        </div>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </ScrollArea>
        </div>
      </Accordion>
    </>
  );
}
