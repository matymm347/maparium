import "@maptiler/geocoding-control/style.css";
import { useState, useRef } from "react";
import { GeocodingControl } from "@maptiler/geocoding-control/react";
import { Check, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const places = [
  {
    value: "new-york-ny",
    label: "New York, NY",
    address: "New York, New York, United States",
  },
  {
    value: "los-angeles-ca",
    label: "Los Angeles, CA",
    address: "Los Angeles, California, United States",
  },
  {
    value: "chicago-il",
    label: "Chicago, IL",
    address: "Chicago, Illinois, United States",
  },
  {
    value: "houston-tx",
    label: "Houston, TX",
    address: "Houston, Texas, United States",
  },
  {
    value: "phoenix-az",
    label: "Phoenix, AZ",
    address: "Phoenix, Arizona, United States",
  },
  {
    value: "philadelphia-pa",
    label: "Philadelphia, PA",
    address: "Philadelphia, Pennsylvania, United States",
  },
  {
    value: "san-antonio-tx",
    label: "San Antonio, TX",
    address: "San Antonio, Texas, United States",
  },
  {
    value: "san-diego-ca",
    label: "San Diego, CA",
    address: "San Diego, California, United States",
  },
  {
    value: "dallas-tx",
    label: "Dallas, TX",
    address: "Dallas, Texas, United States",
  },
  {
    value: "austin-tx",
    label: "Austin, TX",
    address: "Austin, Texas, United States",
  },
];

export default function AddressSearch({ apiKey, mapController }) {
  // Accept apiKey and mapController as props
  // If not provided, fallback to nothing
  // Use GeocodingControl from @maptiler/geocoding-control/react
  // Style to fit navbar
  // ...existing code...
  // eslint-disable-next-line
  // @ts-ignore
  return (
    <div style={{ minWidth: "200px", maxWidth: "400px", width: "100%" }}>
      {apiKey && mapController ? (
        <div style={{ width: "100%" }}>
          <GeocodingControl apiKey={apiKey} mapController={mapController} />
        </div>
      ) : null}
    </div>
  );
}
