# 🗺️ Maparium

**Maparium** is a lightweight and fast web application that provides real-time access to geospatial data across Poland. Built as a comprehensive GIS platform, it will offer multiple data layers including flood predictions, drought visualization, demographic data, and more - serving as a modern alternative to slow and difficult-to-use official portals.

Designed for everyday citizens, students, journalists, and curious minds. The official "Hydroportal", although feature-rich for GIS professionals and government officials, is way too slow and hard to read for spontaneous use. Maparium's mission is to make this GIS data as accessible and intuitive as possible.

Built with **React (TypeScript)** and **Vite**, it features a hybrid mapping setup that combines a **MapTiler** basemap with **custom geospatial data layers** served via a self-hosted **TileServer-GL** instance.

At its current demo stage, the app displays a fullscreen interactive map with expandable data layer functionality.

---

## Features

- 🌊 **Flood hazard map**
- 🖥 **Vector Tiles**: Hosted via self-managed **TileServer-GL**

---

## Upcoming

Here are some features planned for future development:

- [ ] Additional environmental data layers (air quality, temperature, precipitation, demographics, drought areas)
- [ ] Geolocation-based map centering
- [ ] Search bar for quickly zooming to specific locations
- [ ] Historical data comparison tools
- [ ] Multilingual support (English & Polish)
- [ ] Mobile-responsive design improvements

Have an idea for a new data layer or feature? Feel free to open an issue or contribute!

---

## Available Data Layers

### Environmental

- **Flood hazard map**: Areas of flood hazard for rivers where the probability of river flooding is moderate and equals 1% (once every 100 years)

_More layers are continuously being added._

---

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Mapping**: MapTiler base map + custom vector layers
- **Tile Server**: TileServer-GL (self-hosted)
- **Data pre-processing**: QGIS, tippecanoe

---

## Screenshot

![Maparium screenshot](./assets/screenshot.png)

---

## Setup & Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/maparium.git
   cd maparium
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env
   # Configure your MapTiler API key and tile server endpoints
   ```

3. **Development Server**

   ```bash
   npm run dev
   ```

4. **Tile server**

   Use your preffered way of hosting mbtiles. Maparium is using TileServer-GL [TileServer-GL GitHub](https://github.com/maptiler/tileserver-gl).

---

## Data Source

Maparium aggregates data from various Polish governmental through https://dane.gov.pl/pl
