/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { FaPlane } from "react-icons/fa";
import {
  extractSeatNumber,
  formatDateToDayMonth,
  formatTime,
  getCityShortForm,
  getDayShortName,
} from "./HelperFunctions";

const TicketCard = ({ filterType }) => {
  const tickets = useSelector((state) => state.tickets.data);
  const today = new Date().toISOString().split("T")[0];
  const filteredTickets = tickets.filter((ticket) => {
    const ticketDate = new Date(ticket.date).toISOString().split("T")[0];
    if (filterType === "active") return ticketDate >= today;
    if (filterType === "completed") return ticketDate < today;
    return true;
  });

  if (filteredTickets.length === 0) {
    return <p className="text-center mt-2">Sorry! You don&apos;t have any tickets.</p>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {filteredTickets.map((ticket, index) => (
        <div key={index} className="max-w-xs w-full bg-white shadow-lg rounded-3xl p-5 relative">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-medium italic">{ticket?.adminName}</h2>
            <span className="text-red-500 font-bold">{ticket.busDetails?.busNumber}</span>
          </div>

          {/* Route Info */}
          <div className="flex justify-between items-center text-center">
            <div>
              <p className="text-sm text-gray-500">{getDayShortName(ticket.date)}</p>
              <p className="text-lg font-bold">{getCityShortForm(ticket.route.startCity)}</p>
              <p className="text-xs">{ticket.route.startCity}</p>
            </div>
            <img
              src={`https://www.freeiconspng.com/uploads/bus-png-${Math.floor(Math.random() * 5) + 1}.png`}
              className="h-14"
              alt="Bus Logo"
            />
            <div>
              <p className="text-sm text-gray-500">{getDayShortName(ticket.date)}</p>
              <p className="text-lg font-bold">{getCityShortForm(ticket.route.endCity)}</p>
              <p className="text-xs">{ticket.route.endCity}</p>
            </div>
          </div>

          {/* Dotted Line Separator */}
          <div className="my-4 border-dashed border-b-2 relative">
            <div className="absolute w-4 h-4 bg-gray-900 rounded-full -left-2 top-1/2 transform -translate-y-1/2"></div>
            <div className="absolute w-4 h-4 bg-gray-900 rounded-full -right-2 top-1/2 transform -translate-y-1/2"></div>
          </div>

          {/* Passenger & Additional Info */}
          <div className="text-sm p-2">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">Passenger</p>
                {/* Fetch customerName entered during seat selection */}
                <p className="font-semibold">{ticket.user}</p>
              </div>
              <div>
                <p className="text-gray-500">Gender</p>
                <p
                  className={`font-semibold ${
                    ticket.gender === "M"
                      ? "text-blue-500"
                      : ticket.gender === "F"
                      ? "text-pink-500"
                      : "text-gray-500"
                  }`}
                >
                  {ticket.gender || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <div>
                <p className="text-gray-500">Class</p>
                <p className="font-semibold">{ticket.busDetails.standard.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-gray-500">Seat</p>
                <p className="font-semibold">{extractSeatNumber(ticket.seatNumber)}</p>
              </div>
            </div>
          </div>

          {/* Departure & Arrival Info */}
          <div className="text-sm p-2 flex justify-between">
            <div>
              <p className="text-gray-500">Departure</p>
              <p className="font-semibold">{formatTime(ticket?.departureTime)}</p>
            </div>
            <div>
              <p className="text-gray-500">Arrival</p>
              <p className="font-semibold">{formatTime(ticket?.arrivalTime)}</p>
            </div>
          </div>

          {/* Dotted Line Separator */}
          <div className="my-4 border-dashed border-b-2 relative">
            <div className="absolute w-4 h-4 bg-gray-900 rounded-full -left-2 top-1/2 transform -translate-y-1/2"></div>
            <div className="absolute w-4 h-4 bg-gray-900 rounded-full -right-2 top-1/2 transform -translate-y-1/2"></div>
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default TicketCard;
