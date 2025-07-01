import { useState, useMemo } from "react";
import { Search, MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Mock address data for demonstration
const mockAddresses = [
  "123 Main Street, New York, NY 10001",
  "456 Oak Avenue, Los Angeles, CA 90210",
  "789 Pine Road, Chicago, IL 60601",
  "321 Elm Street, Houston, TX 77001",
  "654 Maple Drive, Phoenix, AZ 85001",
  "987 Cedar Lane, Philadelphia, PA 19101",
  "147 Birch Boulevard, San Antonio, TX 78201",
  "258 Willow Way, San Diego, CA 92101",
  "369 Spruce Street, Dallas, TX 75201",
  "741 Ash Avenue, San Jose, CA 95101",
  "852 Poplar Place, Austin, TX 73301",
  "963 Hickory Hill, Jacksonville, FL 32099",
];

export default function Component() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredAddresses = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return mockAddresses
      .filter((address) =>
        address.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 6); // Limit to 6 suggestions
  }, [searchQuery]);

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
    setSearchQuery(address);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedAddress("");
    setShowSuggestions(false);
  };

  return (
    <div className="w-full max-w-lg space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="address-search"
              type="text"
              placeholder="Wyszukiwanie..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="pl-10 pr-10 h-10 border-gray-200 focus:border-gray-300 focus:ring-gray-300 rounded-full"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && filteredAddresses.length > 0 && (
            <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-xl border-gray-200">
              <CardContent className="p-0">
                <div className="max-h-64 overflow-y-auto">
                  {filteredAddresses.map((address, index) => (
                    <button
                      key={index}
                      onClick={() => handleAddressSelect(address)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 leading-relaxed">
                          {address}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Selected Address Display */}
      {selectedAddress && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800 mb-1">
                  Selected Address
                </p>
                <p className="text-sm text-green-700">{selectedAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results Message */}
      {showSuggestions && searchQuery && filteredAddresses.length === 0 && (
        <Card className="border-gray-200">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">
              No addresses found matching your search.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
