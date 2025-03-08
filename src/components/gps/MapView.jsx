import { useState, useEffect } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import axios from "axios";
import LocationDemographics from "./LocationDemographics";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const MapView = () => {
  // States for driver & rider locations and routing info
  const [driverLocation, setDriverLocation] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [alternativeRoutes, setAlternativeRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY || process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Get rider's current location from browser geolocation
  const getRiderLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setRiderLocation({ lat: latitude, lng: longitude });
        },
        (error) => console.error("Error fetching rider location:", error),
        { enableHighAccuracy: true }
      );
    } else {
      console.error("Geolocation is not supported.");
    }
  };

  // Get driver's location.
  // In a real app, this might be provided by a backend service.
  const getDriverLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDriverLocation({ lat: latitude, lng: longitude });
        },
        (error) => console.error("Error fetching driver location:", error),
        { enableHighAccuracy: true }
      );
    } else {
      console.error("Geolocation is not supported.");
    }
  };

  // Poll both locations every 5 seconds for real-time updates.
  useEffect(() => {
    getRiderLocation();
    getDriverLocation();
    const interval = setInterval(() => {
      getRiderLocation();
      getDriverLocation();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate route with alternative options and live timings.
  useEffect(() => {
    if (driverLocation && riderLocation && window.google) {
      const calculateRoute = async () => {
        try {
          const directionsService = new window.google.maps.DirectionsService();
          const results = await directionsService.route({
            origin: driverLocation,
            destination: riderLocation,
            travelMode: window.google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true,
            drivingOptions: {
              departureTime: new Date(),
              trafficModel: window.google.maps.TrafficModel.BEST_GUESS,
            },
          });
          // Store all alternative routes
          setAlternativeRoutes(results.routes);
          // Set default route (first alternative)
          setSelectedRouteIndex(0);
          setDirectionsResponse({ ...results, routes: [results.routes[0]] });
          setDistance(results.routes[0].legs[0].distance.text);
          setDuration(results.routes[0].legs[0].duration.text);
          setDepartureTime(
            results.routes[0].legs[0].departure_time?.text || "N/A"
          );
          setArrivalTime(
            results.routes[0].legs[0].arrival_time?.text || "N/A"
          );
        } catch (error) {
          console.error("Error calculating route:", error);
        }
      };
      calculateRoute();
    }
  }, [driverLocation, riderLocation]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={13}
        center={driverLocation || riderLocation || { lat: 0, lng: 0 }}
      >
        {/* Driver Marker */}
        {driverLocation && (
          <Marker
            position={driverLocation}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/bus.png",
              scaledSize: new window.google.maps.Size(60, 60),
            }}
          />
        )}
        {/* Rider Marker */}
        {riderLocation && (
          <Marker
            position={riderLocation}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}
        {/* Render selected route */}
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>

      {/* Live details panel */}
      <LocationDemographics
        distance={distance}
        duration={duration}
        departureTime={departureTime}
        arrivalTime={arrivalTime}
      />

      {/* Route Selection Options */}
      {alternativeRoutes.length > 1 && (
        <div className="p-4">
          <h3 className="text-black font-bold mb-2">Select a Route:</h3>
          <div className="flex flex-wrap gap-2">
            {alternativeRoutes.map((route, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedRouteIndex(index);
                  setDirectionsResponse({
                    ...directionsResponse,
                    routes: [route],
                  });
                  setDistance(route.legs[0].distance.text);
                  setDuration(route.legs[0].duration.text);
                  setDepartureTime(
                    route.legs[0].departure_time?.text || "N/A"
                  );
                  setArrivalTime(route.legs[0].arrival_time?.text || "N/A");
                }}
                className={`px-4 py-2 rounded-full transition transform hover:scale-105 ${
                  selectedRouteIndex === index
                    ? "bg-yellow-500 text-black"
                    : "bg-white/20 text-black"
                }`}
              >
                Route {index + 1}: {route.legs[0].distance.text} |{" "}
                {route.legs[0].duration.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
