import "@maptiler/geocoding-control/style.css";
import { GeocodingControl } from "@maptiler/geocoding-control/react";

export default function AddressSearch({ apiKey, mapController }) {
  return (
    <div className="maparium-address-search w-full min-w-0 max-w-none">
      {apiKey && mapController ? (
        <div className="w-full min-w-0">
          <GeocodingControl apiKey={apiKey} mapController={mapController} />
        </div>
      ) : null}
    </div>
  );
}
