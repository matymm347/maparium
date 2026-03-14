import MapView from "./MapView";
import Navbar from "./Navbar";
import { useEffect, useRef, useState } from "react";

const PREFERS_DARK_QUERY = "(prefers-color-scheme: dark)";

const getSystemTheme = () => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return "dark";
  }

  return window.matchMedia(PREFERS_DARK_QUERY).matches ? "dark" : "light";
};

function App() {
  // Lift apiKey and mapController state up to App
  const [apiKey, setApiKey] = useState();
  const [mapController, setMapController] = useState();
  const [legendEntries, setLegendEntries] = useState([]);
  const [theme, setTheme] = useState(() => getSystemTheme());
  const hasManualThemeOverrideRef = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    if (!window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia(PREFERS_DARK_QUERY);
    const handleThemeChange = (event) => {
      if (hasManualThemeOverrideRef.current) {
        return;
      }

      setTheme(event.matches ? "dark" : "light");
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleThemeChange);
    } else {
      mediaQuery.addListener(handleThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleThemeChange);
      } else {
        mediaQuery.removeListener(handleThemeChange);
      }
    };
  }, []);

  const toggleTheme = () => {
    hasManualThemeOverrideRef.current = true;
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <>
      <MapView
        setApiKey={setApiKey}
        setMapController={setMapController}
        setLegendEntries={setLegendEntries}
        theme={theme}
      />
      <Navbar
        apiKey={apiKey}
        mapController={mapController}
        legendEntries={legendEntries}
        theme={theme}
        onThemeToggle={toggleTheme}
      />
    </>
  );
}

export default App;
