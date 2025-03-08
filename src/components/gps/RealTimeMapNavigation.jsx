import { useEffect, useState } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../api/settings";
import LocationDemographics from "./LocationDemographics";
import { useSelector } from "react-redux";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const RealTimeNavigationMap = () => {
  const { busId } = useParams();
  const buses = useSelector((state) => state.buses.data);
  const selectedBus = buses.find((bus) => bus._id === busId);

  const [driverLocation, setDriverLocation] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  // New states for alternative routes and live timings
  const [alternativeRoutes, setAlternativeRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Fetch driver location from your API
  const fetchDriverLocation = async () => {
    try {
      const { data } = await axios.post(`${apiBaseUrl}/location/fetch`, {
        busId,
      });
      const updatedLocation = {
        lat: data.data.driverLatitude,
        lng: data.data.driverLongitude,
      };
      setDriverLocation((prevLocation) => {
        if (
          prevLocation &&
          prevLocation.lat === updatedLocation.lat &&
          prevLocation.lng === updatedLocation.lng
        ) {
          return prevLocation; // No change
        }
        return updatedLocation;
      });
    } catch (error) {
      console.error("Error fetching driver location:", error);
    }
  };

  // Fetch destination coordinates based on a provided address.
  // Default to selectedBus.route.endCity if no destination is passed.
  const fetchDestinationCoords = async (destination = selectedBus?.route.endCity) => {
    try {
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: destination,
            key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          },
        }
      );
      const location = data.results[0]?.geometry.location;
      setDestinationCoords(location);
    } catch (error) {
      console.error("Error fetching destination coordinates:", error);
    }
  };

  // Initial fetches: driver location and destination coordinates.
  useEffect(() => {
    fetchDriverLocation();
    if (selectedBus) {
      fetchDestinationCoords();
    }
  }, [busId, selectedBus]);

  // Poll driver location every 3 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDriverLocation();
    }, 3000);
    return () => clearInterval(interval);
  }, [busId]);

  // Calculate route with alternative options and live timings.
  useEffect(() => {
    if (driverLocation && destinationCoords && window.google) {
      const calculateRoute = async () => {
        try {
          const directionsService = new window.google.maps.DirectionsService();
          const results = await directionsService.route({
            origin: driverLocation,
            destination: destinationCoords,
            travelMode: window.google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true,
            drivingOptions: {
              departureTime: new Date(), // Live departure time
              trafficModel: window.google.maps.TrafficModel.BEST_GUESS,
            },
          });
          // Store all alternative routes.
          setAlternativeRoutes(results.routes);
          // Set default route (first alternative).
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
  }, [driverLocation, destinationCoords]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={10}
        center={driverLocation || destinationCoords}
      >
        {/* Driver Marker */}
        {driverLocation && (
          <Marker
            position={driverLocation}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/bus.png",
              scaledSize: new window.google.maps.Size(60, 60),
            }}
            animation={window.google.maps.Animation.DROP}
          />
        )}
        {/* Render selected route */}
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>

      {/* Display live distance, duration, and departure/arrival times */}
      <LocationDemographics
        distance={distance}
        duration={duration}
        departureTime={departureTime}
        arrivalTime={arrivalTime}
      />

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
                  // Update displayed route
                  setDirectionsResponse({ ...directionsResponse, routes: [route] });
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
                    : "bg-white/20 text-white"
                }`}
              >
                Route {index + 1}: {route.legs[0].distance.text} | {route.legs[0].duration.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stops and Destination Change */}
      <div className="stops p-4">
        <h3 className="text-white font-bold mb-2">Stops:</h3>
        {selectedBus?.route?.stops.map((stop, index) => (
          <div key={index} className="mb-2">
            <p className="text-white">
              Stop {index + 1}: {stop.name}
            </p>
            <button
              onClick={() => fetchDestinationCoords(stop.name)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealTimeNavigationMap;
