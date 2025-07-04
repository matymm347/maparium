import { Layers2 } from "lucide-react";
import LayerSelection from "./LayerSelection";
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

export default function LayerDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {/* Button overlay */}
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 10,
          }}
        >
          <Button variant="outline" size="icon">
            <Layers2 size={20} />
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Map Type</DrawerTitle>
            <DrawerDescription>
              Choose map type and corresponding layers
            </DrawerDescription>
          </DrawerHeader>
          <LayerSelection />
          <DrawerFooter></DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
