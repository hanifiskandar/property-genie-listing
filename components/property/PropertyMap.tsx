import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatPrice } from "@/lib/utils";

// Fix default leaflet marker icon
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
  price: number;
}

export default function PropertyMap({ latitude, longitude, title, price }: PropertyMapProps) {
  // Suppress SSR warning — this component is always dynamic-imported with ssr: false
  useEffect(() => {}, []);

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-sm text-gray-600">{formatPrice(price)}</div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
