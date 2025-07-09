const layers = {
  flood: {
    river_probability_10: {
      visible: false,
      name: "River flood hazard area (10%)",
      layerName: "obszar_zagrozenia_powodziowego_10",
      color: "#00C2FF",
    },
    river_probability_1: {
      visible: false,
      name: "River flood hazard area (1%)",
      layerName: "obszar_zagrozenia_powodziowego_1",
      color: "#A259FF",
    },
    river_probability_02: {
      visible: false,
      name: "River flood hazard area (0.2%)",
      layerName: "obszar_zagrozenia_powodziowego_02",
      color: "#FF3864",
    },
    river_probability_wz: {
      visible: false,
      name: "River flood risk (levee breach)",
      layerName: "obszar_zagrozenia_powodziowego_02",
      color: "#FF3864",
    },
    sea_probability_1: {
      visible: false,
      name: "Coastal flood hazard area (1%)",
      layerName: "obszar_zagrozenia_pow_morze_1_M",
      color: "#00D19A",
    },
    sea_probability_02: {
      visible: false,
      name: "Coastal flood hazard area (0.2%)",
      layerName: "obszar_zagrozenia_pow_morze_02_M",
      color: "#FF9900",
    },
    sea_probability_wz: {
      visible: false,
      name: "Coastal flood risk (levee breach)",
      layerName: "obszar_zagrozenia_pow_morze_WZ",
      color: "#FFD700",
    },
  },
};

export { layers };
