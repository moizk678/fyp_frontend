/* eslint-disable react/prop-types */
import { GiPathDistance } from "react-icons/gi";
import { BsFillStopwatchFill } from "react-icons/bs";

const LocationDemographics = ({ distance, duration, departureTime, arrivalTime }) => {
  return (
    <div className="absolute top-16 right-4 bg-white p-4 shadow-lg rounded-xl z-10 mr-2">
      <p className="flex gap-2 items-center text-gray-800 font-semibold">
        <GiPathDistance className="text-primary text-2xl" />
        Distance: {distance}
      </p>
      <p className="flex gap-2 items-center text-gray-800 font-semibold mt-2">
        <BsFillStopwatchFill className="text-primary text-xl" />
        Estimated Time: {duration}
      </p>
      {departureTime && (
        <p className="flex gap-2 items-center text-gray-800 font-semibold mt-2">
          Departure: {departureTime}
        </p>
      )}
      {arrivalTime && (
        <p className="flex gap-2 items-center text-gray-800 font-semibold mt-2">
          Arrival: {arrivalTime}
        </p>
      )}
    </div>
  );
};

export default LocationDemographics;

