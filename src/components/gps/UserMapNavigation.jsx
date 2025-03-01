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
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Fetch initial destination (default: final destination from the bus route)
  useEffect(() => {
    const fetchDestinationCoords = async () => {
      try {
        const { data } = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json`,
          {
            params: {
              address: `${selectedBus.route.endCity}`,
              //   address: "House#600 Johar Town, F Block, Lahore",
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

    if (selectedBus) {
      fetchDestinationCoords();
    }
  }, [selectedBus]);

  // Fetch User Location Continuously
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
        },
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Calculate Route
  useEffect(() => {
    if (userLocation && destinationCoords) {
      const calculateRoute = async () => {
        try {
          const directionsService = new window.google.maps.DirectionsService();
          const results = await directionsService.route({
            origin: userLocation,
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
  }, [userLocation, destinationCoords]);

  // Handle Destination Change
  const handleSelectDestination = async (stopName) => {
    try {
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: stopName,
            key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          },
        }
      );
      const location = data.results[0]?.geometry.location;
      setDestinationCoords(location);
    } catch (error) {
      console.error("Error fetching stop coordinates:", error);
    }
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={15}
        center={userLocation || destinationCoords}
      >
        {/* Render Directions */}
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>

      <LocationDemographics distance={distance} duration={duration} />

      {/* List of Stops to Change Destination */}
      <button
        onClick={() =>
          window.open(
            `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destinationCoords.lat},${destinationCoords.lng}&travelmode=driving`,
            "_blank"
          )
        }
        className="bg-green-500 text-white px-4 py-2 rounded-full mt-4 mx-auto"
      >
        Start Navigation in Google Maps
      </button>
      <div>
        <h3 className="text-center text-xl font-semibold flex justify-center items-center gap-1">
          Switch Destination <BiSolidEditLocation className="text-2xl" />
        </h3>

        {selectedBus?.route.stops.map((stop, index) => (
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
    </div>
  );
};

export default UserMapNavigation;
