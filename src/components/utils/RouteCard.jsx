import { useNavigate } from "react-router-dom";
import { CgArrowLongRightC } from "react-icons/cg";
import { formatDateToDayMonth, formatTime } from "./HelperFunctions";
import { FaBusAlt } from "react-icons/fa";

const RouteCard = ({
  id,
  origin,
  destination,
  departureTime,
  price,
  date,
  route,
  imageSrc,
  adminName,
}) => {
  const navigate = useNavigate();
  return (
    <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-6 m-4 transition-transform transform hover:scale-105 hover:shadow-2xl">
      {/* Bus Service Name */}
      <p className="text-center font-bold flex justify-center items-center gap-2 text-lg text-white">
        {adminName} <FaBusAlt className="text-yellow-400" />
      </p>

      {/* Route Info */}
      <div className="flex justify-center items-center my-4 text-white font-semibold text-lg">
        <p>{origin}</p>
        <CgArrowLongRightC className="mx-2 text-3xl text-blue-300" />
        <p>{destination}</p>
      </div>

      {/* Image & Ticket Info */}
      <div className="grid grid-cols-1 md:grid-cols-[40%_60%] items-center">
        <div className="flex justify-center">
          <img
            className="rounded-lg w-auto h-32 max-w-full object-contain"
            src={imageSrc}
            alt={destination}
          />
        </div>
        <div className="flex flex-col justify-center items-center space-y-3 mt-3 md:mt-0">
          <p className="text-green-300 font-medium">💰 Only in</p>
          <p className="text-2xl font-bold text-white">Rs. {price}</p>
          <p className="bg-gray-200/50 px-4 py-2 rounded-lg text-sm font-semibold text-white backdrop-blur-md">
            📅 {formatDateToDayMonth(date)} | ⏰ {formatTime(departureTime)}
          </p>
          <p className="bg-yellow-400 px-4 py-2 rounded-lg text-sm font-semibold text-gray-800">
            {route.stops.length === 0 ? "🛑 Non Stop" : `🚏 Stops: ${route.stops.length}`}
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => navigate(`/seat-selection/${id}`)}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl mt-6 w-full transition-transform transform hover:scale-105 shadow-lg"
      >
        🎟️ Book my Ticket
      </button>
    </div>
  );
};

export default RouteCard;
