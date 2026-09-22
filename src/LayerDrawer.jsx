import { Layers } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function LayerDrawer({
  children,
}) {
  // Glows on every page load and stays lit until the user clicks it,
  // rather than being remembered permanently across visits.
  const [showLayersHint, setShowLayersHint] = useState(true);

  const hideLayersHint = () => {
    if (!showLayersHint) {
      return;
    }

    setShowLayersHint(false);
  };

  return (
    <Drawer direction="left">
      {/* Button overlay */}
      <div
        className="relative"
        style={{
          position: "absolute",
          bottom: 80,
          left: 24,
          zIndex: 10,
        }}
      >
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Open layers panel"
            className={showLayersHint ? "layer-button-attention" : undefined}
            onClick={hideLayersHint}
          >
            <Layers size={20} />
          </Button>
        </DrawerTrigger>
      </div>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Layers</DrawerTitle>
            <DrawerDescription>
              Choose type and corresponding layers
            </DrawerDescription>
          </DrawerHeader>
          {children}
          <DrawerFooter></DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
