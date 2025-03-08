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
import { useSelector } from "react-redux";
import LocationDemographics from "./LocationDemographics";
import { BiSolidEditLocation } from "react-icons/bi";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const UserMapNavigation = () => {
  const { busId } = useParams();
  const buses = useSelector((state) => state.buses.data);
  const selectedBus = buses.find((bus) => bus._id === busId);

  const [userLocation, setUserLocation] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [alternativeRoutes, setAlternativeRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Fetch destination coordinates (default: bus end city) or update based on stop selection.
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

  // Fetch user's location using browser geolocation.
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => console.error("Error getting user location:", error),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // On mount, fetch the default destination.
  useEffect(() => {
    if (selectedBus) {
      fetchDestinationCoords();
    }
  }, [selectedBus]);

  // Calculate route with alternative options and live timings.
  useEffect(() => {
    if (userLocation && destinationCoords && window.google) {
      const calculateRoute = async () => {
        try {
          const directionsService = new window.google.maps.DirectionsService();
          const results = await directionsService.route({
            origin: userLocation,
            destination: destinationCoords,
            travelMode: window.google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true,
            drivingOptions: {
              departureTime: new Date(),
              trafficModel: window.google.maps.TrafficModel.BEST_GUESS,
            },
          });
          setAlternativeRoutes(results.routes);
          setSelectedRouteIndex(0);
          // Set the default route.
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
  }, [userLocation, destinationCoords]);

  // Handle destination change via stop selection.
  const handleSelectDestination = async (stopName) => {
    await fetchDestinationCoords(stopName);
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={15}
        center={userLocation || destinationCoords || { lat: 0, lng: 0 }}
      >
        {/* Render user marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}
        {/* Render destination marker */}
        {destinationCoords && (
          <Marker
            position={destinationCoords}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}
        {/* Render the selected route */}
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>

      {/* Live Details Panel */}
      <LocationDemographics
        distance={distance}
        duration={duration}
        departureTime={departureTime}
        arrivalTime={arrivalTime}
      />

      {/* Open Google Maps Navigation Button */}
      {userLocation && destinationCoords && (
        <button
          onClick={() =>
            window.open(
              `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destinationCoords.lat},${destinationCoords.lng}&travelmode=driving`,
              "_blank"
            )
          }
          className="bg-green-500 text-white px-4 py-2 rounded-full mt-4 mx-auto block"
        >
          Start Navigation in Google Maps
        </button>
      )}

      {/* Route Selection Options */}
      {alternativeRoutes.length > 1 && (
        <div className="p-4">
          <h3 className="text-black font-bold mb-2 flex items-center gap-1">
            Switch Destination <BiSolidEditLocation className="text-2xl" />
          </h3>
          <div className="flex flex-wrap gap-2">
            {alternativeRoutes.map((route, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedRouteIndex(index);
                  setDirectionsResponse({ ...directionsResponse, routes: [route] });
                  setDistance(route.legs[0].distance.text);
                  setDuration(route.legs[0].duration.text);
                  setDepartureTime(route.legs[0].departure_time?.text || "N/A");
                  setArrivalTime(route.legs[0].arrival_time?.text || "N/A");
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

      {/* Stops for Destination Change */}
      {selectedBus?.route?.stops && (
        <div className="p-4">
          <h3 className="text-black font-bold mb-2">Switch Destination:</h3>
          {selectedBus.route.stops.map((stop, index) => (
            <div
              key={index}
              className="bg-white flex justify-between items-center px-4 py-2 rounded-xl gap-4 my-2"
            >
              <p>
                Stop {index + 1}: {stop.name}
              </p>
              <p>Duration: {stop.duration} minutes</p>
              <button
                onClick={() => handleSelectDestination(stop.name)}
                className="bg-primary text-white px-4 py-1 rounded-full"
              >
                Select Route
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserMapNavigation;
