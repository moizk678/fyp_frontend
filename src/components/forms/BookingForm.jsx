import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiBaseUrl } from "../api/settings";
import { formatTime } from "../utils/HelperFunctions";
import Loader from "../utils/Loader";
import toast from "react-hot-toast";

const BookingForm = () => {
  const navigate = useNavigate();

  // State for search and fetched data
  const [hasSearched, setHasSearched] = useState(false);
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [cities, setCities] = useState([]);
  
  // Separate loading states for initial data fetch and search filtering
  const [isFetching, setIsFetching] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [formData, setFormData] = useState({
    fromCity: "",
    toCity: "",
    date: "",
  });

  // Fetch buses and extract unique cities on mount.
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setIsFetching(true);
        const response = await fetch(`${apiBaseUrl}/bus`);
        if (!response.ok) {
          throw new Error("Failed to fetch buses");
        }
        const data = await response.json();
        setBuses(data);

        // Extract unique cities from bus routes.
        const uniqueCities = Array.from(
          new Set(data.flatMap((bus) => [bus.route.startCity, bus.route.endCity]))
        );
        setCities(uniqueCities);
      } catch (error) {
        console.error("Error fetching buses:", error);
        toast.error("Failed to load bus data. Please try again later.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchBuses();
  }, []);

  // Update form data as the user types.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Filter buses based on search criteria.
  const filterBuses = () => {
    const { fromCity, toCity, date } = formData;
    if (!fromCity || !toCity || !date) return [];

    // Convert date to YYYY-MM-DD format for matching.
    const selectedDate = new Date(date).toISOString().split("T")[0];

    const results = buses.filter((bus) => {
      // Account for bus date format (sometimes nested inside $date).
      const busDateString = bus.date && bus.date.$date ? bus.date.$date : bus.date;
      const busDate = new Date(busDateString);
      if (isNaN(busDate)) {
        console.error("Invalid bus date:", busDateString);
        return false;
      }
      const formattedBusDate = busDate.toISOString().split("T")[0];

      // Ensure cities match (ignoring case and extra spaces).
      const citiesMatch =
        bus.route.startCity.trim().toLowerCase() === fromCity.trim().toLowerCase() &&
        bus.route.endCity.trim().toLowerCase() === toCity.trim().toLowerCase();
      const datesMatch = formattedBusDate === selectedDate;

      return citiesMatch && datesMatch;
    });

    return results;
  };

  // Validate inputs and filter buses.
  const handleSubmit = (e) => {
    e.preventDefault();
    const { fromCity, toCity, date } = formData;
    
    // Basic client-side validation.
    if (!fromCity || !toCity || !date) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (fromCity.trim().toLowerCase() === toCity.trim().toLowerCase()) {
      toast.error("Departure and destination cities cannot be the same.");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    const results = filterBuses();
    setFilteredBuses(results);
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-transparent p-8 flex justify-center items-center">
      <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 p-8 w-full max-w-4xl animate-fade-in">
        <h1 className="text-center font-bold text-3xl text-yellow-300 mb-6 animate-fade-in">
          Let's Book a Ride 🚌
        </h1>

        <div className="flex flex-col lg:grid grid-cols-10 gap-10">
          {/* Bus Image Section */}
          <div className="col-span-4 flex justify-center items-center">
            <img
              src="https://www.freeiconspng.com/uploads/bus-png-4.png"
              alt="Bus"
              className="w-2/3 lg:w-full transition-transform transform hover:scale-110"
            />
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="col-span-6 w-full">
            <div className="flex flex-col space-y-6 p-6 bg-white/20 shadow-lg rounded-xl w-full mx-auto backdrop-blur-md animate-fade-in">
              {/* From City Dropdown */}
              <div className="relative flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-white/30 focus-within:ring-2 focus-within:ring-yellow-300">
                <select
                  name="fromCity"
                  value={formData.fromCity}
                  onChange={handleInputChange}
                  className="w-full bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-0 appearance-none"
                  required
                >
                  <option value="" className="bg-gray-900 text-white">Select Departure City</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city} className="bg-gray-800 text-white hover:bg-yellow-400">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* To City Dropdown */}
              <div className="relative flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-white/30 focus-within:ring-2 focus-within:ring-yellow-300">
                <select
                  name="toCity"
                  value={formData.toCity}
                  onChange={handleInputChange}
                  className="w-full bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-0 appearance-none"
                  required
                >
                  <option value="" className="bg-gray-900 text-white">Select Destination City</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city} className="bg-gray-800 text-white hover:bg-yellow-400">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Input */}
              <div className="relative flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-white/30 focus-within:ring-2 focus-within:ring-yellow-300">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-0"
                  required
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
                disabled={isFetching || isSearching}
              >
                {isSearching ? "Searching..." : "Search Buses"}
              </button>
            </div>
          </form>
        </div>

        {/* Display Loader while fetching initial data */}
        {isFetching && (
          <div className="flex justify-center mt-8">
            <Loader />
          </div>
        )}

        {/* Display Search Results */}
        {!isFetching && (
          <>
            {isSearching ? (
              <div className="flex justify-center mt-8">
                <Loader />
              </div>
            ) : filteredBuses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {filteredBuses.map((bus) => (
                  <div
                    key={bus._id}
                    className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6 transition transform hover:scale-105 hover:shadow-2xl text-white"
                  >
                    <p className="text-yellow-300 text-lg font-semibold text-center mb-2">
                      {bus?.route?.startCity} ➝ {bus?.route?.endCity}
                    </p>
                    <p className="mb-2">📅 Date: {new Date(bus?.date).toDateString()}</p>
                    <p className="mb-2">
                      ⏳ Time: {formatTime(bus?.departureTime)} - {formatTime(bus?.arrivalTime)}
                    </p>
                    <p className="mb-2">🪑 Seats: {bus?.busCapacity}</p>
                    <p className="mb-2">🚌 Bus: {bus?.busDetails?.busNumber}</p>
                    <p className="mb-2">💰 Fare: ${bus?.fare?.actualPrice}</p>
                    <button
                      onClick={() => navigate(`/seat-selection/${bus?._id}`, { state: { bus } })}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4 w-full transition-transform transform hover:scale-105"
                    >
                      Book My Ticket
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              hasSearched && (
                <p className="text-center text-white mt-4">
                  No buses available for this route on the selected date.
                </p>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
