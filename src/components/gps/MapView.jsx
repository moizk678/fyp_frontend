import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapView = () => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);

  const getCurrentLocation = (setLocation) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error fetching location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Get locations of both users when the component mounts
  useEffect(() => {
    getCurrentLocation(setDriverLocation);
    getCurrentLocation(setRiderLocation);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {driverLocation && riderLocation ? (
        <MapContainer
          center={[
            (driverLocation.lat + riderLocation.lat) / 2,
            (driverLocation.lng + riderLocation.lng) / 2,
          ]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          {/* Add map tiles */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Driver marker */}
          <Marker position={driverLocation}>
            <Popup>Driver Location</Popup>
          </Marker>

          {/* Rider marker */}
          <Marker position={riderLocation}>
            <Popup>Rider Location</Popup>
          </Marker>

          {/* Line tracing the route */}
          <Polyline
            positions={[driverLocation, riderLocation]}
            color="blue"
            weight={5}
          />
        </MapContainer>
      ) : (
        <p>Fetching locations...</p>
      )}
    </div>
  );
};

export default MapView;
