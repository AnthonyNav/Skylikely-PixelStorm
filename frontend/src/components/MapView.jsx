import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useAppStore } from "@store/useAppStore.js";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41],
});

function ClickHandler() {
  const setCoords = useAppStore((s) => s.setCoords);
  useMapEvents({ click(e){ setCoords(e.latlng.lat, e.latlng.lng); } });
  return null;
}

export default function MapView() {
  const { lat, lon } = useAppStore();
  return (
    <MapContainer center={[lat, lon]} zoom={8} style={{ width:"100%", height:"100%" }}>
      <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      <Marker position={[lat, lon]} icon={icon} />
      <ClickHandler />
    </MapContainer>
  );
}
