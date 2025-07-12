const initialLayers = {
  flood: {
    river_probability_10: {
      visible: false,
      name: "River flood hazard area (10%)",
      layerName: "river_flood_risk_10",
      color: "#00C2FF",
    },
    river_probability_1: {
      visible: false,
      name: "River flood hazard area (1%)",
      layerName: "river_flood_risk_1",
      color: "#A259FF",
    },
    river_probability_02: {
      visible: false,
      name: "River flood hazard area (0.2%)",
      layerName: "river_flood_risk_02",
      color: "#FF3864",
    },
    river_probability_wz: {
      visible: false,
      name: "River flood risk (levee breach)",
      layerName: "river_flood_risk_levee_breach",
      color: "#FF3864",
    },
    sea_probability_1: {
      visible: false,
      name: "Coastal flood hazard area (1%)",
      layerName: "sea_flood_risk_1",
      color: "#00D19A",
    },
    sea_probability_02: {
      visible: false,
      name: "Coastal flood hazard area (0.2%)",
      layerName: "sea_flood_risk_02",
      color: "#FF9900",
    },
    sea_probability_wz: {
      visible: false,
      name: "Coastal flood risk (levee breach)",
      layerName: "sea_flood_risk_levee_breach",
      color: "#FFD700",
    },
  },
  drought: {
    agriculture: {
      visible: false,
      name: "Agricultural drought risk",
      layerName: "agriculture",
      color: "#FFCC00",
    },
    atmospheric: {
      visible: false,
      name: "Atmospheric drought risk",
      layerName: "atmospheric",
      color: "#FF9900",
    },
    geohydro: {
      visible: false,
      name: "Geohydrological drought risk",
      layerName: "geohydro",
      color: "#FF6600",
    },
    hydro: {
      visible: false,
      name: "Hydrological drought risk",
      layerName: "hydro",
      color: "#FF3300",
    },
    summary: {
      visible: false,
      name: "Drought risk summary",
      layerName: "summary",
      color: "#FF0000",
    },
  },
};

export { initialLayers };
