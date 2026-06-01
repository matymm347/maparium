import MapView from "./MapView";
import Navbar from "./Navbar";
import AboutPage from "./AboutPage";
import PrivacyPage from "./PrivacyPage";
import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const PREFERS_DARK_QUERY = "(prefers-color-scheme: dark)";
const THEME_STORAGE_KEY = "maparium:theme";

const getStoredTheme = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === "dark" || storedTheme === "light" ? storedTheme : null;
};

const getSystemTheme = () => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return "dark";
  }

  return window.matchMedia(PREFERS_DARK_QUERY).matches ? "dark" : "light";
};

function App() {
  const [apiKey, setApiKey] = useState();
  const [mapController, setMapController] = useState();
  const [legendEntries, setLegendEntries] = useState([]);
  const [homeResetToken, setHomeResetToken] = useState(0);
  const [theme, setTheme] = useState(
    () => getStoredTheme() ?? getSystemTheme(),
  );
  const [isNavigatingAwayFromMap, setIsNavigatingAwayFromMap] = useState(false);
  const pendingNavigationPathRef = useRef(null);
  const hasManualThemeOverrideRef = useRef(getStoredTheme() !== null);
  const location = useLocation();
  const navigate = useNavigate();
  const isMapRoute = location.pathname === "/";
  const isAboutRoute = location.pathname.startsWith("/about");
  const isPrivacyRoute = location.pathname.startsWith("/privacy");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;

    if (hasManualThemeOverrideRef.current) {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
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

  useEffect(() => {
    if (!isNavigatingAwayFromMap) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      navigate(pendingNavigationPathRef.current ?? "/about");
      pendingNavigationPathRef.current = null;
      setIsNavigatingAwayFromMap(false);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isNavigatingAwayFromMap, navigate]);

  const toggleTheme = () => {
    hasManualThemeOverrideRef.current = true;
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  const navigateFromMapTo = (path) => {
    if (!isMapRoute) {
      navigate(path);
      return;
    }

    pendingNavigationPathRef.current = path;
    setApiKey(undefined);
    setMapController(undefined);
    setLegendEntries([]);
    setIsNavigatingAwayFromMap(true);
  };

  const handleAboutNavigate = () => {
    navigateFromMapTo("/about");
  };

  const handlePrivacyNavigate = () => {
    navigateFromMapTo("/privacy");
  };

  const handleHomeNavigate = () => {
    if (isMapRoute) {
      setLegendEntries([]);
      setHomeResetToken((currentToken) => currentToken + 1);
      navigate("/", { replace: true });
      return;
    }

    navigate("/");
  };

  let pageContent;

  if (isMapRoute) {
    pageContent = (
      <MapView
        key="map-route"
        setApiKey={setApiKey}
        setMapController={setMapController}
        setLegendEntries={setLegendEntries}
        homeResetToken={homeResetToken}
        theme={theme}
      />
    );
  } else if (isAboutRoute) {
    pageContent = <AboutPage key="about-route" />;
  } else if (isPrivacyRoute) {
    pageContent = <PrivacyPage key="privacy-route" />;
  } else {
    pageContent = <Navigate to="/" replace />;
  }

  return (
    <>
      {pageContent}
      <Navbar
        apiKey={apiKey}
        mapController={mapController}
        legendEntries={isMapRoute ? legendEntries : []}
        theme={theme}
        onHomeNavigate={handleHomeNavigate}
        onThemeToggle={toggleTheme}
        onAboutNavigate={handleAboutNavigate}
        onPrivacyNavigate={handlePrivacyNavigate}
        pathname={location.pathname}
        showSearch={isMapRoute && !isNavigatingAwayFromMap}
      />
    </>
  );
}

export default App;
