import { Layers2 } from "lucide-react";
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

export default function LayerDrawer({ children }) {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        {/* Button overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 12,
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
