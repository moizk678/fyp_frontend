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
      console.log("UPDATED BUSES", updatedBuses);
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
    <div className="p-4">
      {location.pathname === "/" && <BookingForm />}
      <div className="grid grid-cols-10 justify-center items-center mt-4">
        <h1 className="col-span-7 font-bold text-center mt-4">
          Offered Routes
        </h1>
        <div className="col-span-3">
          Choose Filter
          <select
            className="border border-gray-300 rounded-xl p-2"
            onChange={(e) => setSelectedFilter(e.target.value)}
            value={selectedFilter}
          >
            <option value="All">All</option>
            <option value="LowToHigh">Price (Low to High)</option>
            <option value="HighToLow">Price (High to Low)</option>
            <option value="AscendingDate">Date (Ascending)</option>
            <option value="DescendingDate">Date (Descending)</option>
            <option value="Today">Today</option>
            {companies.map((company, index) => (
              <option key={index} value={company.name}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === "loading" ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
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

      {/* Show More Button */}
      {filteredBuses.length > 9 && !showAll && (
        <div className="text-center mt-4">
          <button className="app-btn" onClick={handleShowMore}>
            Show More
          </button>
        </div>
      )}
      {showAll && filteredBuses.length > 9 && (
        <div className="text-center mt-4">
          <button className="app-btn" onClick={handleShowLess}>
            Show Less
          </button>
        </div>
      )}
    </div>
  );
};

export default MainContent;
