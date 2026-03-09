import MapView from "./MapView";
import Navbar from "./Navbar";
import { useState } from "react";

function App() {
  // Lift apiKey and mapController state up to App
  const [apiKey, setApiKey] = useState();
  const [mapController, setMapController] = useState();
  const [legendEntries, setLegendEntries] = useState([]);

  return (
    <>
      <MapView
        setApiKey={setApiKey}
        setMapController={setMapController}
        setLegendEntries={setLegendEntries}
      />
      <Navbar
        apiKey={apiKey}
        mapController={mapController}
        legendEntries={legendEntries}
      />
    </>
  );
}

export default App;
