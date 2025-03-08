/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // using your original import style
import { apiBaseUrl } from "../api/settings";
import { GiPathDistance } from "react-icons/gi";
import L from "leaflet";
import { haversineDistance } from "../utils/HelperFunctions";

// Helper function to decode a Google encoded polyline
const decodePolyline = (encoded) => {
  if (!encoded) return [];
  let points = [];
  let index = 0,
    len = encoded.length;
  let lat = 0,
    lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
    lng += dlng;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
};

const riderIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const RiderMap = () => {
  const [riderLocation, setRiderLocation] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [ticketInfo, setTicketInfo] = useState([]);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  // New states for route alternatives
  const [alternativeRoutes, setAlternativeRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [routePath, setRoutePath] = useState([]);

  // Fetch ticket information
  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = token ? jwtDecode(token) : null;
    if (!decodedToken) return;
    const fetchTicketInformation = async () => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/ticket/user/information/${decodedToken?.sub}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setTicketInfo(data);
      } catch (error) {
        console.error("Error fetching ticket info:", error);
      }
    };
    fetchTicketInformation();
  }, []);

  // Fetch rider's location and update backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = token ? jwtDecode(token) : null;

    if (!decodedToken || ticketInfo.length === 0) return;
    const fetchRiderLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await axios.post(`${apiBaseUrl}/location/update`, {
              userId: decodedToken?.sub,
              latitude,
              longitude,
              role: "user",
              busId: ticketInfo[0].busId,
            });
          } catch (error) {
            console.error("Error updating rider location:", error);
          }
          setRiderLocation({ lat: latitude, lng: longitude });
        },
        (error) => console.error("Error fetching location:", error),
        { enableHighAccuracy: true }
      );
    };

    fetchRiderLocation();
    const interval = setInterval(fetchRiderLocation, 5000);
    return () => clearInterval(interval);
  }, [ticketInfo]);

  // Fetch driver's location from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = token ? jwtDecode(token) : null;

    if (!decodedToken || ticketInfo.length === 0) return;
    const fetchDriverLocation = async () => {
      try {
        const response = await axios.post(`${apiBaseUrl}/location/fetch`, {
          busId: ticketInfo[0]?.busId,
          userId: decodedToken?.sub,
        });
        const driverData = response.data.data;
        if (driverData?.driverLatitude && driverData?.driverLongitude) {
          setDistance(
            haversineDistance(
              driverData?.driverLatitude,
              driverData?.driverLongitude,
              driverData?.userLatitude,
              driverData?.userLongitude
            )
          );
          setDriverLocation({
            lat: driverData.driverLatitude,
            lng: driverData.driverLongitude,
          });
        }
      } catch (error) {
        console.error("Error fetching driver location:", error);
      }
    };
    fetchDriverLocation();
    const interval = setInterval(fetchDriverLocation, 5000);
    return () => clearInterval(interval);
  }, [ticketInfo]);

  // Fetch route alternatives using Google Directions API (REST)
  useEffect(() => {
    if (driverLocation && riderLocation) {
      const fetchRoutes = async () => {
        try {
          const response = await axios.get(
            "https://maps.googleapis.com/maps/api/directions/json",
            {
              params: {
                origin: `${driverLocation.lat},${driverLocation.lng}`,
                destination: `${riderLocation.lat},${riderLocation.lng}`,
                mode: "driving",
                alternatives: true,
                departure_time: "now",
                key:
                  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
                  process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
              },
            }
          );
          const data = response.data;
          if (data.routes && data.routes.length > 0) {
            setAlternativeRoutes(data.routes);
            setSelectedRouteIndex(0);
            const selectedRoute = data.routes[0];
            setDistance(selectedRoute.legs[0].distance.text);
            setDuration(selectedRoute.legs[0].duration.text);
            setDepartureTime(
              selectedRoute.legs[0].departure_time
                ? selectedRoute.legs[0].departure_time.text
                : "N/A"
            );
            setArrivalTime(
              selectedRoute.legs[0].arrival_time
                ? selectedRoute.legs[0].arrival_time.text
                : "N/A"
            );
            const decodedPath = decodePolyline(selectedRoute.overview_polyline.points);
            console.log("Decoded route path:", decodedPath);
            setRoutePath(decodedPath);
          } else {
            console.error("No routes found.");
          }
        } catch (error) {
          console.error("Error fetching routes:", error);
        }
      };
      fetchRoutes();
    }
  }, [driverLocation, riderLocation]);

  return (
    <>
      {/* Live details overlay */}
      <h1 className="absolute z-10 flex gap-3 justify-center items-center text-white top-0 left-1/2 transform -translate-x-1/2 text-center bg-primary rounded-2xl px-4 py-2 text-xl">
        <GiPathDistance /> {distance ? distance : "Calculating..."}
      </h1>

      <div style={{ height: "100vh", width: "100%" }}>
        {riderLocation && (
          <MapContainer center={riderLocation} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {/* Markers */}
            <Marker position={riderLocation} icon={riderIcon} />
            {driverLocation && <Marker position={driverLocation} />}
            {/* Draw route if available */}
            {routePath && routePath.length > 0 && (
              <Polyline positions={routePath} color="blue" weight={4} />
            )}
          </MapContainer>
        )}
      </div>

      {/* Route Selection Options */}
      {alternativeRoutes.length > 1 && (
        <div className="p-4">
          <h3 className="text-white font-bold mb-2">Select a Route:</h3>
          <div className="flex flex-wrap gap-2">
            {alternativeRoutes.map((route, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedRouteIndex(index);
                  setDistance(route.legs[0].distance.text);
                  setDuration(route.legs[0].duration.text);
                  setDepartureTime(
                    route.legs[0].departure_time
                      ? route.legs[0].departure_time.text
                      : "N/A"
                  );
                  setArrivalTime(
                    route.legs[0].arrival_time
                      ? route.legs[0].arrival_time.text
                      : "N/A"
                  );
                  const decodedPath = decodePolyline(route.overview_polyline.points);
                  console.log("Decoded route path (selected):", decodedPath);
                  setRoutePath(decodedPath);
                }}
                className={`px-4 py-2 rounded-full transition transform hover:scale-105 ${
                  selectedRouteIndex === index
                    ? "bg-yellow-500 text-black"
                    : "bg-white/20 text-black"
                }`}
              >
                Route {index + 1}: {route.legs[0].distance.text} | {route.legs[0].duration.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default RiderMap;
