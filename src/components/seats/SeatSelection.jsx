/* eslint-disable react/prop-types */
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiBaseUrl } from "../api/settings";

const SeatSelection = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [busData, setBusData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSeat, setCurrentSeat] = useState(null);
  const colCount = 4; // assuming a grid with 4 columns

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/bus/${id}`);
        setBusData(response.data);
      } catch (error) {
        console.error("Error fetching bus data:", error);
        navigate("/");
      }
    };

    if (id) {
      fetchBusData();
    }
  }, [id, navigate]);

  const handleSeatClick = (seat) => {
    // Allow clicking only if seat is available and not already selected
    if (!seat.booked && !selectedSeats.some((s) => s.seatNumber === seat.seatNumber)) {
      setCurrentSeat(seat);
      setShowModal(true);
    }
  };

  const handleInputChange = (field, value) => {
    setCurrentSeat((prevSeat) => ({ ...prevSeat, [field]: value }));
  };

  const handleConfirmSeat = () => {
    // Check that both customerName and gender have been entered
    if (currentSeat.customerName && currentSeat.gender) {
      // Find seat index in busData
      const seatIndex = busData.seats.findIndex(
        (s) => s.seatNumber === currentSeat.seatNumber
      );
      if (seatIndex === -1) {
        alert("Invalid seat selection.");
        return;
      }
      const row = Math.floor(seatIndex / colCount);
      const rowStart = row * colCount;
      const rowEnd = rowStart + colCount;
      let conflictFound = false;
      const adjacentIndices = [];
      // Only check immediate left and right seats.
      if (seatIndex % colCount !== 0) adjacentIndices.push(seatIndex - 1);
      if (seatIndex % colCount !== colCount - 1) adjacentIndices.push(seatIndex + 1);

      adjacentIndices.forEach((adjIndex) => {
        if (adjIndex >= rowStart && adjIndex < rowEnd) {
          const adjacentSeat = busData.seats[adjIndex];
          // Skip check if the adjacent seat is already being booked in this family booking.
          const isFamilyBooking = selectedSeats.some(
            (s) => s.seatNumber === adjacentSeat.seatNumber
          );
          if (adjacentSeat.booked && !isFamilyBooking && adjacentSeat.gender) {
            // Conflict only applies on left/right.
            if (adjacentSeat.gender !== currentSeat.gender) {
              conflictFound = true;
            }
          }
        }
      });

      if (conflictFound) {
        alert(
          "Cannot book this seat due to an adjacent gender conflict. (Note: Front or back seats are allowed.)"
        );
        return;
      }

      // Create a ticket object with customerName and gender
      const ticket = { 
        ...currentSeat, 
        customerName: currentSeat.customerName, 
        gender: currentSeat.gender 
      };

      // Add the seat to the selected seats array.
      setSelectedSeats((prevSeats) => [...prevSeats, ticket]);
      setShowModal(false);
    } else {
      alert("Please fill in both Customer Name and Gender.");
    }
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.every((seat) => seat?.customerName && seat?.gender)) {
      // Pass along selected seats; payment component will compute total price using busData fare.
      navigate(`/payments/${id}`, { state: { reservedSeats: selectedSeats } });
    } else {
      alert("Please fill in all details for each selected seat.");
    }
  };

  const handleCancel = () => {
    setBusData(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 via-violet-700 to-indigo-900 p-6">
      <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 w-full max-w-4xl p-8">
        <h2 className="text-3xl text-white font-bold text-center mb-6">🚌 Bus Seat Booking</h2>

        {/* Seat Grid */}
        <div className="grid grid-cols-4 gap-3 justify-center p-4 bg-gray-900/80 rounded-lg shadow-lg">
          {busData?.seats.map((seat, index) => {
            const selectedSeat = selectedSeats.find(
              (s) => s.seatNumber === seat.seatNumber
            );
            return (
              <Seat
                key={index}
                seat={seat}
                index={index}
                selectedSeat={selectedSeat}
                onClick={() => handleSeatClick(seat)}
              />
            );
          })}
        </div>

        {/* Cancel & Proceed Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
          >
            Cancel
          </button>

          {selectedSeats.length > 0 && (
            <button
              onClick={handleProceedToPayment}
              className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all"
            >
              Proceed to Payment
            </button>
          )}
        </div>
      </div>

      {/* Modal for seat confirmation */}
      {showModal && currentSeat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white/20 backdrop-blur-md shadow-2xl rounded-2xl border border-white/30 w-96 p-6 animate-fade-in">
            <h3 className="font-bold text-center text-xl text-white mb-4">
              🎟️ Confirm Seat # {parseInt(currentSeat.seatNumber.split("-")[1])}
            </h3>

            {/* Customer Name Input */}
            <label className="block mb-2 text-sm font-semibold text-gray-200">
              Customer Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={currentSeat.customerName || ""}
              onChange={(e) => handleInputChange("customerName", e.target.value)}
              className="w-full border border-gray-400 bg-gray-800 text-white placeholder-gray-400 rounded-lg p-3 mb-3 focus:border-yellow-400 focus:outline-none transition-all"
            />

            {/* Gender Selection */}
            <label className="block mb-2 text-sm font-semibold text-gray-200">
              Gender
            </label>
            <select
              value={currentSeat.gender || ""}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className="w-full border border-gray-400 bg-gray-800 text-white rounded-lg p-3 mb-4 focus:border-yellow-400 focus:outline-none transition-all"
            >
              <option value="" className="text-white">
                Select Gender
              </option>
              <option value="M" className="text-white">
                Male
              </option>
              <option value="F" className="text-white">
                Female
              </option>
            </select>

            {/* Confirm & Cancel Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={handleConfirmSeat}
                className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-transform transform hover:scale-105 shadow-lg"
              >
                ✅ Confirm
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105 shadow-lg"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Seat = ({ seat, index, selectedSeat, onClick }) => {
  // Determine the seat style:
  // 1. If the seat is already booked (by someone else) -> red.
  // 2. If the seat is selected by the current user -> blue for male, pink for female.
  // 3. Otherwise, available seat styling.
  let seatColor = "";
  let textColor = "";

  if (selectedSeat) {
    seatColor = selectedSeat.gender === "M" ? "bg-blue-400" : "bg-pink-400";
    textColor = "text-white";
  } else if (seat.booked) {
    seatColor = "bg-red-400 cursor-not-allowed";
    textColor = "text-white";
  } else {
    seatColor = "bg-gray-300 hover:bg-green-400 cursor-pointer";
    textColor = "text-black";
  }

  return (
    <div
      className={`w-12 h-12 flex items-center justify-center font-bold rounded-lg shadow-md ${seatColor} ${textColor} transition-all`}
      onClick={onClick}
    >
      {seat.booked ? seat.gender : parseInt(seat.seatNumber.split("-")[1])}
    </div>
  );
};

export default SeatSelection;
