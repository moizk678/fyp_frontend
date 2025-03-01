import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AvailableNavigationBuses = () => {
  const tickets = useSelector((state) => state.tickets.data);
  const navigate = useNavigate();

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Filter tickets for today or future dates
  const upcomingTickets = tickets.filter((ticket) => {
    const ticketDate = new Date(ticket.date).toISOString().split("T")[0];
    return ticketDate >= today;
  });

  return (
    <div className="flex flex-col space-y-4">
      {upcomingTickets.map((ticket, index) => (
        <div
          key={index}
          className="flex flex-col lg:flex-row bg-white shadow-md rounded-lg p-4 items-start lg:items-center"
        >
          {/* Bus Details */}
          <div className="flex-1">
            <h2 className="font-bold text-lg text-gray-800">
              {ticket.busDetails?.busNumber} - {ticket.busDetails?.standard}
            </h2>
            <p className="text-gray-600">
              Capacity: {ticket.busDetails?.busCapacity}
            </p>
            <p className="text-gray-600">
              Fuel Type: {ticket.busDetails?.fuelType}
            </p>
            <p className="text-gray-600">
              AC: {ticket.busDetails?.ac ? "Yes" : "No"}
            </p>
            <p className="text-gray-600">
              WiFi: {ticket.busDetails?.wifi ? "Yes" : "No"}
            </p>
            <p className="text-gray-600">
              Route: {ticket.route.startCity} - {ticket.route.endCity}
            </p>
            <p className="text-gray-600">
              Departure: {ticket.departureTime} | Arrival: {ticket.arrivalTime}
            </p>
          </div>

          {/* Choose Button */}
          <div className="mt-4 lg:mt-0">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => navigate(`/map/user/${ticket.busId}`)}
            >
              Choose
            </button>
          </div>
        </div>
      ))}
      {upcomingTickets.length === 0 && (
        <div className="text-center text-gray-500">
          No bus available for Navigation.
        </div>
      )}
    </div>
  );
};

export default AvailableNavigationBuses;
