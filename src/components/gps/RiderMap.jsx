/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
// import { apiBaseUrl } from "../api/settings";
import { jwtDecode } from "jwt-decode";
import { apiBaseUrl } from "../api/settings";
import { GiPathDistance } from "react-icons/gi";
import L from "leaflet";
import { haversineDistance } from "../utils/HelperFunctions";

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
  const [distance, setDistance] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = token ? jwtDecode(token) : null;
    const fetchTicketInformation = async () => {
      {
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
      }
    };

    fetchTicketInformation();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = token ? jwtDecode(token) : null;

    if (!decodedToken) {
      console.error("No token found or token is invalid.");
      return;
    }
    const fetchRiderLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Update rider location in the backend
          console.log("Ticket Infor", ticketInfo);
          await axios.post(`${apiBaseUrl}/location/update`, {
            userId: decodedToken?.sub,
            latitude,
            longitude,
            role: "user",
            busId: ticketInfo[0].busId,
          });

          setRiderLocation({ lat: latitude, lng: longitude });
        },
        (error) => console.error("Error fetching location: ", error),
        { enableHighAccuracy: true }
      );
    };

    // Fetch driver location
    const fetchDriverLocation = async () => {
      const response = await axios.post(`${apiBaseUrl}/location/fetch`, {
        busId: ticketInfo[0]?.busId,
        userId: decodedToken?.sub,
      });
      const driverData = response.data.data;
      setDistance(
        haversineDistance(
          driverData?.driverLatitude,
          driverData?.driverLongitude,
          driverData?.userLatitude,
          driverData?.userLongitude
        )
      );

      if (driverData?.driverLatitude && driverData?.driverLongitude) {
        setDriverLocation({
          lat: driverData?.driverLatitude,
          lng: driverData?.driverLongitude,
        });
      }
    };

    fetchRiderLocation();
    fetchDriverLocation();

    const interval = setInterval(() => {
      fetchRiderLocation();
      fetchDriverLocation();
    }, 5000);

    return () => clearInterval(interval);
  }, [ticketInfo]);

  return (
    <>
      <h1 className="absolute z-10 flex gap-3 justify-center items-center text-white top-0 left-1/2 transform -translate-x-1/2 text-center bg-primary rounded-2xl px-4 py-2 text-xl">
        <GiPathDistance />
        Distance: 100 meters
      </h1>

      <div style={{ height: "100vh", width: "100%" }}>
        {riderLocation && (
          <MapContainer
            center={riderLocation}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {/* Markers */}
            <Marker position={riderLocation} icon={riderIcon} />

            {driverLocation && <Marker position={driverLocation} />}

            {/* Polyline (only if both locations are available) */}
            {driverLocation && riderLocation && (
              <Polyline
                positions={[riderLocation, driverLocation]}
                color="blue"
              />
            )}
          </MapContainer>
        )}
      </div>
    </>
  );
};

export default RiderMap;
