import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useAppStore } from "@store/useAppStore.js";

// Token público de Mapbox válido para testing
const MAPBOX_TOKEN = "pk.eyJ1IjoidGVzdGluZy1tYXBib3giLCJhIjoiY2wyY2RobzY5MDIzczNkcGZua3o2OTFvcSJ9.YnJlT0g4Q3NlQnZCY0l3Vw";

export default function MapboxView() {
  const { lat, lon, setCoords } = useAppStore();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    try {
      // Set Mapbox access token
      mapboxgl.accessToken = MAPBOX_TOKEN;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: {
          "version": 8,
          "sources": {
            "osm": {
              "type": "raster",
              "tiles": [
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              ],
              "tileSize": 256,
              "attribution": "© OpenStreetMap contributors"
            }
          },
          "layers": [
            {
              "id": "osm",
              "type": "raster",
              "source": "osm"
            }
          ]
        },
        projection: "globe", // Proyección globe con transición automática
        center: [lon, lat],
        zoom: 2,
        pitch: 0,
        bearing: 0,
        antialias: true
      });
    } catch (error) {
      console.error("Error initializing Mapbox:", error);
      
      // Fallback sin globe projection si falla
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: {
          "version": 8,
          "sources": {
            "osm": {
              "type": "raster",
              "tiles": [
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              ],
              "tileSize": 256,
              "attribution": "© OpenStreetMap contributors"
            }
          },
          "layers": [
            {
              "id": "osm",
              "type": "raster",
              "source": "osm"
            }
          ]
        },
        center: [lon, lat],
        zoom: 2,
        antialias: true
      });
    }

    // Configuraciones adicionales para el globo
    map.current.on("style.load", () => {
      try {
        // Configurar la atmósfera del globo solo si está disponible
        if (map.current.setFog) {
          map.current.setFog({
            "range": [0.5, 10],
            "color": "#ffffff",
            "horizon-blend": 0.1,
            "high-color": "#add8e6",
            "space-color": "#000000",
            "star-intensity": 0.15
          });
        }

        // Transición automática a mercator al hacer zoom
        map.current.on("zoom", () => {
          const zoom = map.current.getZoom();
          if (zoom > 5 && map.current.setProjection) {
            map.current.setProjection("mercator");
          } else if (map.current.setProjection) {
            map.current.setProjection("globe");
          }
        });
      } catch (error) {
        console.warn("Globe features not available:", error);
      }
    });

    // Crear marcador inicial
    marker.current = new mapboxgl.Marker({
      color: "#EF4444",
      scale: 1.2
    })
      .setLngLat([lon, lat])
      .addTo(map.current);

    // Event listener para clicks en el mapa
    map.current.on("click", (e) => {
      const { lng, lat: clickedLat } = e.lngLat;
      
      // Actualizar coordenadas en el store
      setCoords(clickedLat, lng);
      
      // Mover el marcador
      marker.current.setLngLat([lng, clickedLat]);
      
      // Centrar el mapa en el nuevo punto
      map.current.flyTo({
        center: [lng, clickedLat],
        zoom: Math.max(map.current.getZoom(), 6),
        duration: 1000
      });
    });

    // Configurar controles de navegación
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Actualizar posición cuando cambian las coordenadas desde el store
  useEffect(() => {
    if (map.current && marker.current) {
      marker.current.setLngLat([lon, lat]);
      map.current.flyTo({
        center: [lon, lat],
        zoom: Math.max(map.current.getZoom(), 6),
        duration: 1000
      });
    }
  }, [lat, lon]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div 
        ref={mapContainer} 
        style={{ 
          width: "100%", 
          height: "100%",
          borderRadius: "inherit"
        }} 
      />
      
      {/* Loading indicator */}
      <div 
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "rgba(255,255,255,0.9)",
          padding: "8px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          color: "#666",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}
        id="loading-info"
      >
        🌍 Modo Globe - Zoom para cambiar a Mercator
      </div>
    </div>
  );
}
