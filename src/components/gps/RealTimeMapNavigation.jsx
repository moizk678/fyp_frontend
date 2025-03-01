/* eslint-disable no-unused-vars */
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

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Fetch Driver Location
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
          return prevLocation; // No update needed if location is the same
        }
        return updatedLocation;
      });
    } catch (error) {
      console.error("Error fetching driver location:", error);
    }
  };

  // Fetch Destination Coordinates
  const fetchDestinationCoords = async (destination) => {
    try {
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: `${selectedBus.route.endCity}`,
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

  // Initial Fetches
  useEffect(() => {
    fetchDriverLocation();
    fetchDestinationCoords();
  }, [busId]);

  // Polling Driver Location Every 3 Seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDriverLocation();
    }, 3000);

    return () => clearInterval(interval);
  }, [busId]);

  // Calculate Route
  useEffect(() => {
    if (driverLocation && destinationCoords) {
      const calculateRoute = async () => {
        try {
          const directionsService = new window.google.maps.DirectionsService();
          const results = await directionsService.route({
            origin: driverLocation,
            destination: destinationCoords,
            travelMode: window.google.maps.TravelMode.DRIVING,
          });
          setDirectionsResponse(results);
          setDistance(results.routes[0].legs[0].distance.text);
          setDuration(results.routes[0].legs[0].duration.text);
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
        // Don't set the center dynamically; the map will remain where the user left it
        zoom={10}
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

        {/* Route */}
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
      <div className="info">
        <LocationDemographics distance={distance} duration={duration} />
      </div>
      <div className="stops">
        <h3>See the Stops Distance</h3>
        {selectedBus?.route?.stops.map((stop, index) => (
          <div key={index} className="stop">
            <p>
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
