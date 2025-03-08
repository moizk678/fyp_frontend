import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import BookingForm from "../forms/BookingForm";
import RouteCard from "../utils/RouteCard";
import Loader from "../utils/Loader";

const MainContent = () => {
  const buses = useSelector((state) => state.buses.data);
  const companies = useSelector((state) => state.companies.data);
  const status = useSelector((state) => state.buses.status);
  const location = useLocation();

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);

  // Memoized filtered bus list based on the selected filter.
  const filteredBuses = useMemo(() => {
    let updatedBuses = [...buses];

    switch (selectedFilter) {
      case "LowToHigh":
        updatedBuses.sort((a, b) => a.fare.actualPrice - b.fare.actualPrice);
        break;
      case "HighToLow":
        updatedBuses.sort((a, b) => b.fare.actualPrice - a.fare.actualPrice);
        break;
      case "AscendingDate":
        updatedBuses.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "DescendingDate":
        updatedBuses.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "Today": {
        const today = new Date().toISOString().slice(0, 10);
        updatedBuses = updatedBuses.filter(
          (bus) => new Date(bus.date).toISOString().slice(0, 10) === today
        );
        break;
      }
      case "All":
        // No filtering needed.
        break;
      default:
        // Assume any other value represents a company name.
        updatedBuses = updatedBuses.filter(
          (bus) => bus.adminName === selectedFilter
        );
        break;
    }
    return updatedBuses;
  }, [buses, selectedFilter]);

  // Visible buses based on showAll state.
  const visibleBuses = useMemo(
    () => (showAll ? filteredBuses : filteredBuses.slice(0, 9)),
    [filteredBuses, showAll]
  );

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
    setShowAll(false); // Reset show more state when filter changes.
  };

  const handleShowMore = () => setShowAll(true);
  const handleShowLess = () => setShowAll(false);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-900 via-violet-700 to-indigo-900">
      <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 w-full min-h-screen px-10 py-8 animate-fade-in">
        {/* Display Booking Form only on the home page */}
        {location.pathname === "/" && <BookingForm />}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-6">
          <h1 className="text-white text-3xl font-bold">🚌 Offered Routes</h1>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <span className="font-medium text-white">Filter:</span>
            <select
              value={selectedFilter}
              onChange={handleFilterChange}
              className="border border-gray-400 bg-purple-800 text-white rounded-xl px-3 py-2 focus:border-yellow-400 focus:outline-none transition-all appearance-none"
            >
              <option value="All" className="bg-gray-900 text-white">
                All
              </option>
              <option value="LowToHigh" className="bg-gray-900 text-white">
                Price (Low to High)
              </option>
              <option value="HighToLow" className="bg-gray-900 text-white">
                Price (High to Low)
              </option>
              <option value="AscendingDate" className="bg-gray-900 text-white">
                Date (Ascending)
              </option>
              <option value="DescendingDate" className="bg-gray-900 text-white">
                Date (Descending)
              </option>
              <option value="Today" className="bg-gray-900 text-white">
                Today
              </option>
              {companies.map((company, index) => (
                <option
                  key={index}
                  value={company.name}
                  className="bg-gray-800 text-white"
                >
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Routes Listing */}
        {status === "loading" ? (
          <div className="flex justify-center mt-8">
            <Loader />
          </div>
        ) : filteredBuses.length === 0 ? (
          <div className="text-center mt-8 text-white text-xl">
            No routes available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {visibleBuses.map((bus, index) => {
              // Generate a random image number between 1 and 5.
              const randomImageNumber = Math.floor(Math.random() * 5) + 1;
              return (
                <RouteCard
                  key={bus._id || index}
                  id={bus._id}
                  origin={bus.route.startCity}
                  destination={bus.route.endCity}
                  date={bus.date}
                  departureTime={bus.departureTime}
                  arrivalTime={bus.arrivalTime}
                  price={bus.fare.actualPrice}
                  route={bus.route}
                  adminName={bus.adminName}
                  imageSrc={`https://www.freeiconspng.com/uploads/bus-png-${randomImageNumber}.png`}
                />
              );
            })}
          </div>
        )}

        {/* Show More / Show Less Buttons */}
        {filteredBuses.length > 9 && (
          <div className="text-center mt-6">
            {!showAll ? (
              <button
                onClick={handleShowMore}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full px-6 py-2 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              >
                Show More
              </button>
            ) : (
              <button
                onClick={handleShowLess}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full px-6 py-2 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              >
                Show Less
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;
