import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const OrderSummary = () => {
  const { busId } = useParams();
  const buses = useSelector((state) => state.buses.data);
  const busData = buses.find((bus) => bus._id === busId);
  return (
    <div>
      <div className="bg-white p-6 rounded-md">
        {busData ? (
          <>
            <h1 className="text-3xl font-extrabold text-gray-800">
              CheckOut Summary
            </h1>

            <ul className="text-gray-800 mt-8 space-y-4">
              <li className="flex flex-wrap gap-4 text-sm">
                Bus Ticket ({busData.route.startCity} to {busData.route.endCity}
                )
                <span className="ml-auto font-bold">
                  Rs. {busData.fare.actualPrice}
                </span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm font-bold border-t-2 pt-4">
                Total
                <span className="ml-auto">Rs. {busData.fare.actualPrice}</span>
              </li>
            </ul>
          </>
        ) : (
          <p>No bus details available.</p>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
