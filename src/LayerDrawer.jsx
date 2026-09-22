import { Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const triggerContainerRef = useRef(null);

  const hideLayersHint = () => {
    if (!showLayersHint) {
      return;
    }

    setShowLayersHint(false);
  };

  // With the drawer non-modal, nothing blocks pointer events on the map, so
  // a click or drag on it reaches the map directly (e.g. to pan). We still
  // want the panel to close on outside interaction, so we replicate that
  // here without swallowing the event, letting the same gesture that closes
  // the panel also start the map interaction (like a pan drag) right away.
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (contentRef.current?.contains(event.target)) {
        return;
      }

      if (triggerContainerRef.current?.contains(event.target)) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [isOpen]);

  return (
    <Drawer direction="left" open={isOpen} onOpenChange={setIsOpen} modal={false}>
      {/* Button overlay */}
      <div
        ref={triggerContainerRef}
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
      <DrawerContent ref={contentRef}>
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
