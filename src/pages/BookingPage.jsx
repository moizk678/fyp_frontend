/* eslint-disable no-unused-vars */
import { useState } from "react";
import TicketCard from "../components/utils/TicketCard";
import { IoIosNavigate } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const BookingPage = () => {
  const [filterType, setFilterType] = useState("active");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-purple-900 via-violet-700 to-indigo-900 p-8">
      {/* Ticket Filter Section */}
      <div className="mt-8 flex justify-center items-center gap-4 bg-white/10 p-4 rounded-full shadow-md backdrop-blur-lg">
        <button
          className={`px-6 py-3 rounded-full font-semibold transition-all text-lg shadow-md ${
            filterType === "active"
              ? "bg-yellow-400 text-black"
              : "bg-white/20 text-white hover:bg-yellow-400 hover:text-black"
          }`}
          onClick={() => setFilterType("active")}
        >
          🎟 Active Tickets
        </button>
        <button
          className={`px-6 py-3 rounded-full font-semibold transition-all text-lg shadow-md ${
            filterType === "completed"
              ? "bg-yellow-400 text-black"
              : "bg-white/20 text-white hover:bg-yellow-400 hover:text-black"
          }`}
          onClick={() => setFilterType("completed")}
        >
          🕒 Past Tickets
        </button>
      </div>

      {/* Ticket List */}
      <div className="mt-6 w-full max-w-2xl">
        <TicketCard filterType={filterType} />
      </div>

      {/* Track Your Bus Button */}
      <button
        className="mt-10 flex items-center gap-3 px-6 py-3 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-full transition-all shadow-md transform hover:scale-105"
        onClick={() => navigate("/map")}
      >
        🚍 Track Your Bus <IoIosNavigate className="text-2xl" />
      </button>
    </div>
  );
};

export default BookingPage;
