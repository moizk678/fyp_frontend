/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import BookingForm from "../forms/BookingForm";
import RouteCard from "../utils/RouteCard";
import { useLocation } from "react-router-dom";
import Loader from "../utils/Loader";
import { useSelector } from "react-redux";

const MainContent = () => {
  const buses = useSelector((state) => state.buses.data);
  const companies = useSelector((state) => state.companies.data);
  const status = useSelector((state) => state.buses.status);

  const [filteredBuses, setFilteredBuses] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const location = useLocation();
  const [showAll, setShowAll] = useState(false);
  const [visibleBuses, setVisibleBuses] = useState([]);

  useEffect(() => {
    let updatedBuses = [...buses];

    if (selectedFilter === "All") {
      setFilteredBuses(updatedBuses);
    } else if (selectedFilter === "LowToHigh") {
      updatedBuses.sort((a, b) => a.fare.actualPrice - b.fare.actualPrice);
    } else if (selectedFilter === "HighToLow") {
      updatedBuses.sort((a, b) => b.fare.actualPrice - a.fare.actualPrice);
    } else if (selectedFilter === "AscendingDate") {
      updatedBuses.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (selectedFilter === "DescendingDate") {
      updatedBuses.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (selectedFilter === "Today") {
      const today = new Date();
      const todayDate = today.toISOString().slice(0, 10);

      updatedBuses = updatedBuses.filter(
        (bus) => new Date(bus.date).toISOString().slice(0, 10) === todayDate
      );
    } else {
      updatedBuses = updatedBuses.filter(
        (bus) => bus.adminName === selectedFilter
      );
    }

    setFilteredBuses(updatedBuses);
    setVisibleBuses(showAll ? updatedBuses : updatedBuses.slice(0, 9));
  }, [selectedFilter, buses, showAll]);

  const handleShowMore = () => {
    setShowAll(true);
  };
  const handleShowLess = () => {
    setShowAll(false);
    setVisibleBuses(filteredBuses.slice(0, 9));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-900 via-violet-700 to-indigo-900 p-0">
      <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 w-full min-h-screen px-10 py-8 animate-fade-in">
        
        {/* Booking Form */}
        {location.pathname === "/" && <BookingForm />}

        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-10 justify-between items-center mt-6 gap-6">
          <h1 className="md:col-span-7 text-white text-3xl font-bold text-left">
            🚌 Offered Routes
          </h1>
          <div className="md:col-span-3 flex flex-col md:flex-row items-center gap-3 text-white">
  <span className="font-medium">Filter:</span>
  <select
    className="border border-gray-400 bg-purple-800 text-white rounded-xl px-3 py-2 focus:border-yellow-400 focus:outline-none transition-all appearance-none"
    onChange={(e) => setSelectedFilter(e.target.value)}
    value={selectedFilter}
  >
    <option value="All" className="bg-gray-900 text-white">All</option>
    <option value="LowToHigh" className="bg-gray-900 text-white hover:bg-yellow-400">Price (Low to High)</option>
    <option value="HighToLow" className="bg-gray-900 text-white hover:bg-yellow-400">Price (High to Low)</option>
    <option value="AscendingDate" className="bg-gray-900 text-white hover:bg-yellow-400">Date (Ascending)</option>
    <option value="DescendingDate" className="bg-gray-900 text-white hover:bg-yellow-400">Date (Descending)</option>
    <option value="Today" className="bg-gray-900 text-white hover:bg-yellow-400">Today</option>
    {companies.map((company, index) => (
      <option key={index} value={company.name} className="bg-gray-800 text-white hover:bg-yellow-400">
        {company.name}
      </option>
    ))}
  </select>
</div>

        </div>

        {/* Loader */}
        {status === "loading" ? (
          <div className="flex justify-center mt-8">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {visibleBuses.map((bus, index) => {
              const randomImageNumber = Math.floor(Math.random() * 5) + 1;

              return (
                <RouteCard
                  key={index}
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

        {/* Show More/Less Buttons */}
        {filteredBuses.length > 9 && (
          <div className="text-center mt-6">
            {!showAll ? (
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full px-6 py-2 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                onClick={handleShowMore}
              >
                Show More
              </button>
            ) : (
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full px-6 py-2 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                onClick={handleShowLess}
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
