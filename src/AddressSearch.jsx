import "@maptiler/geocoding-control/style.css";
import { GeocodingControl } from "@maptiler/geocoding-control/react";

export default function AddressSearch({ apiKey, mapController }) {
  return (
    <div className="w-full min-w-0 max-w-100 sm:min-w-50">
      {apiKey && mapController ? (
        <div className="w-full min-w-0">
          <GeocodingControl apiKey={apiKey} mapController={mapController} />
        </div>
      ) : null}
    </div>
  );
}
