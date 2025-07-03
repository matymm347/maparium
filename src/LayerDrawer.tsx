"use client";

import { Layers2 } from "lucide-react";
import FilledButton from "./FilledButton";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  // DrawerDescription,
  DrawerFooter,
  DrawerHeader,
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
            {/* <DrawerDescription>Choose map type and .</DrawerDescription> */}
          </DrawerHeader>
          <FilledButton />
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
