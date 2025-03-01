import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiBaseUrl } from "../api/settings";
import { formatTime } from "../utils/HelperFunctions";
import Loader from "../utils/Loader";

const BookingForm = () => {
  const navigate = useNavigate();
  const [hasSearched, setHasSearched] = useState(false);
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fromCity: "",
    toCity: "",
    date: "",
  });

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/bus`);
        const data = await response.json();
        setBuses(data);

        const uniqueCities = Array.from(
          new Set(data.flatMap((bus) => [bus.route.startCity, bus.route.endCity]))
        );
        setCities(uniqueCities);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching buses:", error);
      }
    };

    fetchBuses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const filterBuses = () => {
    const { fromCity, toCity, date } = formData;
    const selectedDate = new Date(date).toISOString().split("T")[0];

    const results = buses.filter((bus) => {
      const busDateString = bus.date && bus.date.$date ? bus.date.$date : bus.date;
      const busDate = new Date(busDateString);
      if (isNaN(busDate)) {
        console.error("Invalid bus date:", busDateString);
        return false;
      }
      const formattedBusDate = busDate.toISOString().split("T")[0];

      const citiesMatch =
        bus.route.startCity.trim().toLowerCase() === fromCity.trim().toLowerCase() &&
        bus.route.endCity.trim().toLowerCase() === toCity.trim().toLowerCase();
      const datesMatch = formattedBusDate === selectedDate;

      return citiesMatch && datesMatch;
    });
    setLoading(false);
    setFilteredBuses(results);
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    setHasSearched(true);
    filterBuses();
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
              <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg">
                Search Buses
              </button>
            </div>
          </form>
        </div>

        {/* Filtered Buses Display */}
        {loading ? (
          <Loader />
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
                <p className="mb-2">⏳ Time: {formatTime(bus?.departureTime)} - {formatTime(bus?.arrivalTime)}</p>
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
          hasSearched && <p className="text-center text-white mt-4">No buses available for this route on the selected date.</p>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
