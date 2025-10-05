import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import { useAppStore } from "@store/useAppStore.js";

// Icono personalizado rojo para el marcador
const customIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    width: 20px;
    height: 20px;
    background: #EF4444;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    position: relative;
  ">
    <div style="
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 8px solid #EF4444;
    "></div>
  </div>`,
  iconSize: [20, 28],
  iconAnchor: [10, 28]
});

function ClickHandler() {
  const setCoords = useAppStore(s => s.setCoords);
  useMapEvents({ click(e){ setCoords(e.latlng.lat, e.latlng.lng); } });
  return null;
}

function FollowCoords() {
  const { lat, lon } = useAppStore();
  const map = useMap();
  map.setView([lat, lon], map.getZoom());
  return null;
}

// Configuraciones de capas de mapa
const mapLayers = {
  street: {
    name: "🗺️ Mapa",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors"
  },
  satellite: {
    name: "🛰️ Satélite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri, Maxar, Earthstar Geographics"
  }
};

export default function MapView() {
  const { lat, lon } = useAppStore();
  const [currentLayer, setCurrentLayer] = useState('street');
  const [showLabels, setShowLabels] = useState(false);

  const selectedLayer = mapLayers[currentLayer];

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Selector de capas */}
      <div 
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "rgba(255,255,255,0.95)",
          padding: "12px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          zIndex: 1000,
          minWidth: "150px"
        }}
      >
        <div style={{ marginBottom: "8px", fontSize: "12px", fontWeight: "600", color: "#374151" }}>
          Tipo de Mapa:
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {Object.entries(mapLayers).map(([key, layer]) => (
            <label key={key} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="radio"
                name="mapLayer"
                value={key}
                checked={currentLayer === key}
                onChange={(e) => setCurrentLayer(e.target.value)}
                style={{ margin: 0 }}
              />
              <span style={{ fontSize: "12px", fontWeight: currentLayer === key ? "600" : "400" }}>
                {layer.name}
              </span>
            </label>
          ))}
        </div>

        {/* Toggle para etiquetas en modo satélite */}
        {currentLayer === 'satellite' && (
          <div style={{ marginTop: "12px", paddingTop: "8px", borderTop: "1px solid #e5e7eb" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                style={{ margin: 0 }}
              />
              <span style={{ fontSize: "11px" }}>📍 Mostrar etiquetas</span>
            </label>
          </div>
        )}
      </div>

      {/* Mapa */}
      <MapContainer center={[lat, lon]} zoom={10} style={{ width:"100%", height:"100%" }}>
        {/* Capa base */}
        <TileLayer 
          key={currentLayer}
          attribution={selectedLayer.attribution} 
          url={selectedLayer.url}
        />
        
        {/* Capa de etiquetas para modo satélite */}
        {currentLayer === 'satellite' && showLabels && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; Esri"
          />
        )}
        
        {/* Marcador personalizado */}
        <Marker position={[lat, lon]} icon={customIcon} />
        
        {/* Manejadores de eventos */}
        <ClickHandler />
        <FollowCoords />
      </MapContainer>
    </div>
  );
}
