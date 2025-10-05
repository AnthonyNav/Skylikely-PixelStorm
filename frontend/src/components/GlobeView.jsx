import { useEffect, useRef } from "react";
import Globe from "globe.gl";
import { useAppStore } from "@store/useAppStore.js";

const makePoint = (lat, lon) => [{ lat, lng: lon }];

export default function GlobeView() {
  const { lat, lon, setCoords } = useAppStore();
  const elRef = useRef(null);
  const globeRef = useRef(null);

  useEffect(() => {
    if (!elRef.current) return;

    const g = Globe()(elRef.current)
      .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-day.jpg")
      .bumpImageUrl("https://unpkg.com/three-globe/example/img/earth-topology.png")
      .backgroundColor("#ffffff")
      .pointOfView({ lat, lng: lon, altitude: 1.8 })
      // capa de puntos (pin)
      .pointsData(makePoint(lat, lon))
      .pointLat(d => d.lat)
      .pointLng(d => d.lng)
      .pointAltitude(() => 0.01)   // altura del pin
      .pointRadius(() => 0.6)      // tamaño del pin
      .pointColor(() => "#EF4444") // color del pin
      .onGlobeClick(({ lat: la, lng: lo }) => {
        setCoords(la, lo);                // actualiza store
        g.pointsData(makePoint(la, lo));  // mueve el pin
        g.pointOfView({ lat: la, lng: lo, altitude: 1.8 }, 600);
      });

    globeRef.current = g;

    const ro = new ResizeObserver(() =>
      g.width(elRef.current.clientWidth).height(elRef.current.clientHeight)
    );
    ro.observe(elRef.current);

    return () => ro.disconnect();
  }, []);

  // si lat/lon cambian por búsqueda o inputs, reubica el pin
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    g.pointsData(makePoint(lat, lon));
    g.pointOfView({ lat, lng: lon, altitude: 1.8 }, 600);
  }, [lat, lon]);

  return <div ref={elRef} style={{ width: "100%", height: "100%" }} />;
}
