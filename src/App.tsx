import MapView from "./MapView";
import Navbar from "./Navbar";

function App() {
  return (
    <>
      <div className="flex flex-col h-screen">
        <Navbar />
        <MapView />
      </div>
    </>
  );
}

export default App;
