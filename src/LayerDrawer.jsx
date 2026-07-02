import { ArrowDownLeft, Layers } from "lucide-react";
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

const LAYERS_HINT_STORAGE_KEY = "maparium:layers-hint-seen";

const shouldShowLayersHint = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(LAYERS_HINT_STORAGE_KEY) !== "true";
};

export default function LayerDrawer({
  children,
}) {
  const [showLayersHint, setShowLayersHint] = useState(shouldShowLayersHint);

  const hideLayersHint = () => {
    if (!showLayersHint) {
      return;
    }

    setShowLayersHint(false);
    window.localStorage.setItem(LAYERS_HINT_STORAGE_KEY, "true");
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
        {showLayersHint ? (
          <div
            className="pointer-events-none absolute bottom-14 left-0 max-w-[11rem] rounded-xl border border-border/70 bg-card/95 px-3 py-2 text-xs font-medium text-card-foreground shadow-lg backdrop-blur dark:border-white/15 dark:bg-card/95"
            role="status"
            aria-live="polite"
          >
            <p className="leading-snug">Choose map layers here</p>
            <ArrowDownLeft
              className="absolute -bottom-5 left-4 h-4 w-4 animate-bounce text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        ) : null}
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Open layers panel"
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
