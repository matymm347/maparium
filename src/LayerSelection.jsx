import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayerIconMap } from "./LayerIconMap";
import { Checkbox } from "@/components/ui/checkbox";

export default function LayerSelection({ layerConfig, updateLayerVisibility }) {
  return (
    <Accordion type="multiple" collapsible="true" defaultValue="item-1">
      <div className="h-[80vh] w-full">
        <ScrollArea className="h-full w-full rounded-md border border-neutral-800 p-4 bg-neutral-900 text-white">
          {Object.keys(layerConfig).map((group) => {
            const Icon = LayerIconMap[layerConfig[group]["lucideIcon"]];
            return (
              <AccordionItem value={group} key={group}>
                <AccordionTrigger>
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
  );
}
