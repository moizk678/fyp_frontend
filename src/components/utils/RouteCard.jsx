/* eslint-disable react/prop-types */
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
    <div className="bg-main mt-2 p-3 shadow-md rounded-xl">
      <p className="text-center font-bold flex justify-center items-center gap-2">
        {adminName} <FaBusAlt />
      </p>
      <div className="flex justify-center items-center ml-4  w-full">
        <p className="">{origin}</p>
        <CgArrowLongRightC className="mx-1 text-3xl" />
        <p className="">{destination}</p>
      </div>
      <div className="grid grid-cols-[35%_65%] md:grid-cols-2 items-center">
        <img className="rounded-md" src={imageSrc} alt={destination} />
        <div>
          <div className="flex flex-col gap-4">
            <div className="ml-4 flex flex-col justify-center items-center">
              <p className="text-tertiary">Only in</p>
              <p className="font-bold">Rs. {price}</p>
              <p className="app-btn text-sm mb-2 text-center">
                {formatDateToDayMonth(date)} {formatTime(departureTime)}
              </p>
              <p className="app-btn text-sm">
                {route.stops.length === 0
                  ? "Non Stop"
                  : `Stops: ${route.stops.length}`}
              </p>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => navigate(`/seat-selection/${id}`)}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4 w-full"
      >
        Book my Ticket
      </button>
    </div>
  );
};

export default RouteCard;
