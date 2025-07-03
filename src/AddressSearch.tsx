import * as React from "react";
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

export default function AddressSearch() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between text-left font-normal"
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">
              {value
                ? places.find((place) => place.value === value)?.label
                : "Search for a place..."}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Type to search places..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No places found.</CommandEmpty>
            <CommandGroup>
              {places.map((place) => (
                <CommandItem
                  key={place.value}
                  value={place.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="flex items-start gap-2 p-3"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{place.label}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {place.address}
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      value === place.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
