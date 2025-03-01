/* eslint-disable no-unused-vars */
import { useState } from "react";
import TicketCard from "../components/utils/TicketCard";
import { IoIosNavigate } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const BookingPage = () => {
  const [filterType, setFilterType] = useState("active");
  const navigate = useNavigate();

  return (
    <div className="content flex flex-col">
      <div className="mt-3 flex justify-center items-center gap-1">
        <button
          className={`text-white py-2 px-6 rounded-full ${
            filterType === "active"
              ? "bg-tertiary text-white"
              : "hover:bg-tertiary hover:text-primary bg-primary"
          }`}
          onClick={() => setFilterType("active")}
        >
          Active Tickets
        </button>
        <button
          className={`text-white py-2 px-6 rounded-full ${
            filterType === "completed"
              ? "bg-tertiary text-white"
              : "hover:bg-tertiary hover:text-primary bg-primary"
          }`}
          onClick={() => setFilterType("completed")}
        >
          Past Tickets
        </button>
      </div>
      <TicketCard filterType={filterType} />
      {/* <button
        className="app-btn flex gap-2 max-w-fit mx-auto mb-20"
        onClick={() => navigate("/map")}
      >
        Track Your Bus <IoIosNavigate className="text-2xl" />
      </button> */}
    </div>
  );
};

export default BookingPage;
