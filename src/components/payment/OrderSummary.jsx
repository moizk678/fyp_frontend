import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";

const OrderSummary = () => {
  const { busId } = useParams();
  const location = useLocation();
  // Retrieve reserved seats passed from the previous screen.
  const reservedSeats = location.state?.reservedSeats || [];
  const buses = useSelector((state) => state.buses.data);
  const busData = buses.find((bus) => bus._id === busId);

  // Calculate total price based on the number of reserved seats.
  const totalPrice = busData ? busData.fare.actualPrice * reservedSeats.length : 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 via-violet-700 to-indigo-900 p-6">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg shadow-2xl border border-white/20 rounded-3xl p-10 animate-fade-in">
        {busData ? (
          <>
            <h1 className="text-2xl font-bold text-white text-center mb-6">
              🧾 Checkout Summary
            </h1>

            <ul className="text-white space-y-5">
              {/* Bus Ticket Details */}
              <li className="flex flex-wrap justify-between text-md p-4 bg-white/20 rounded-xl border border-gray-400 shadow">
                <span>
                  🎟 Bus Ticket ({busData.route.startCity} ➝ {busData.route.endCity})
                </span>
                <span className="font-semibold text-lg">
                  Rs. {busData.fare.actualPrice}
                </span>
              </li>

              {/* Total Price */}
              <li className="flex flex-wrap justify-between text-md font-bold p-4 border-t-2 pt-4 bg-white/20 rounded-xl border border-gray-400 shadow">
                <span>💰 Total</span>
                <span className="text-lg">Rs. {totalPrice}</span>
              </li>
            </ul>
          </>
        ) : (
          <p className="text-center text-white text-lg">
            🚫 No bus details available.
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
