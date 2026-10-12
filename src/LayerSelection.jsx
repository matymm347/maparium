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
import { Switch } from "@/components/ui/switch";
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
        <div className="flex w-fit items-center gap-3 rounded-md bg-blue-100 px-3 py-2 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {isLayerLockEnabled ? (
            <Unlock className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Lock className="h-4 w-4" aria-hidden="true" />
          )}
          <label
            htmlFor="multiple-layers-mode"
            className="text-sm font-medium leading-none"
          >
            Multiple layers mode
          </label>
          <Switch
            id="multiple-layers-mode"
            checked={isLayerLockEnabled}
            onCheckedChange={onToggleLayerLock}
            className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 dark:data-[state=checked]:bg-blue-500 dark:data-[state=unchecked]:bg-gray-700"
          />
        </div>
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
