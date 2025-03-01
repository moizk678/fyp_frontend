import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaBusAlt, FaWifi, FaSnowflake, FaRoad, FaGasPump } from "react-icons/fa";
import { MdOutlineAirlineSeatReclineNormal } from "react-icons/md";

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
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-purple-900 via-violet-700 to-indigo-900 p-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-yellow-400 text-center mb-8 mt-6">
      🚌 Available Buses for Navigation
  </h1>
      {upcomingTickets.length > 0 ? (
        <div className="w-full max-w-5xl space-y-6">
          {upcomingTickets.map((ticket, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-purple-700 to-indigo-600 border border-white/20 shadow-xl rounded-2xl p-6 hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out text-white"
            >
              {/* Bus Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FaBusAlt className="text-yellow-400 text-2xl" />
                  {ticket.busDetails?.busNumber} - {ticket.busDetails?.standard}
                </h2>
                <span className="text-white text-sm bg-blue-500 px-4 py-2 rounded-lg shadow-md font-medium">
                  {ticket.route.startCity} ➝ {ticket.route.endCity}
                </span>
              </div>

              {/* Bus Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-lg">
                <p className="flex items-center gap-2 text-gray-200">
                  <MdOutlineAirlineSeatReclineNormal className="text-yellow-400" />
                  <span className="font-semibold">Seats:</span> {ticket.busDetails?.busCapacity}
                </p>
                <p className="flex items-center gap-2 text-gray-200">
                  <FaGasPump className="text-yellow-400" />
                  <span className="font-semibold">Fuel:</span> {ticket.busDetails?.fuelType}
                </p>
                <p className="flex items-center gap-2 text-gray-200">
                  <FaSnowflake className="text-yellow-400" />
                  <span className="font-semibold">AC:</span> {ticket.busDetails?.ac ? "Yes" : "No"}
                </p>
                <p className="flex items-center gap-2 text-gray-200">
                  <FaWifi className="text-yellow-400" />
                  <span className="font-semibold">WiFi:</span> {ticket.busDetails?.wifi ? "Yes" : "No"}
                </p>
                <p className="flex items-center gap-2 text-gray-200">
                  <FaRoad className="text-yellow-400" />
                  <span className="font-semibold">Departure:</span> {ticket.departureTime}
                </p>
                <p className="flex items-center gap-2 text-gray-200">
                  <FaRoad className="text-yellow-400" />
                  <span className="font-semibold">Arrival:</span> {ticket.arrivalTime}
                </p>
              </div>

              {/* Choose Button */}
              <button
                className="mt-6 w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={() => navigate(`/map/user/${ticket.busId}`)}
              >
                🚏 Start Navigation
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-white text-xl bg-white/10 px-6 py-4 rounded-xl shadow-lg mt-10">
          ❌ No bus available for navigation.
        </div>
      )}
    </div>
  );
};

export default AvailableNavigationBuses;
