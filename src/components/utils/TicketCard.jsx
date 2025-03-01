/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { FaPlane } from "react-icons/fa";
import {
  extractSeatNumber,
  formatDateToDayMonth,
  formatTime,
  getCityShortForm,
  getDayShortName,
} from "./HelperFunctions";

const TicketCard = ({ filterType }) => {
  const tickets = useSelector((state) => state.tickets.data);
  const today = new Date().toISOString().split("T")[0];
  const filteredTickets = tickets.filter((ticket) => {
    const ticketDate = new Date(ticket.date).toISOString().split("T")[0];
    if (filterType === "active") {
      return ticketDate >= today; // Tickets for today or in the future
    }
    if (filterType === "completed") {
      return ticketDate < today; // Tickets from the past
    }
    return true; // Show all tickets if no filter is applied
  });

  if (filteredTickets.length === 0) {
    return (
      <p className="text-center mt-2">
        Sorry! You don&apos;t have any tickets.
      </p>
    );
  }

  return (
    <div className="flex flex-col md:grid grid-cols-3 items-center justify-center bg-center bg-cover">
      {filteredTickets.map((ticket, index) => (
        <div
          key={index}
          className="max-w-md w-full h-full mx-auto z-10 rounded-3xl"
        >
          <div className="flex flex-col">
            <div className="bg-main relative drop-shadow-2xl rounded-3xl p-4 m-4">
              <div className="flex-none sm:flex">
                <div className="relative h-32 w-32 sm:mb-0 mb-3 hidden">
                  <span className="absolute -right-2 bottom-2 text-white p-1 text-xs bg-tertiary hover:bg-tertiary font-medium tracking-wider rounded-full transition ease-in duration-300">
                    <FaPlane className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex-auto justify-evenly">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center my-1">
                      <h2 className="font-medium italic ml-2">
                        {ticket?.adminName}
                      </h2>
                    </div>
                    <div className="ml-auto text-secondary">
                      {ticket.busDetails?.busNumber}
                    </div>
                  </div>
                  <div className="border-dashed border-b-2 my-5"></div>
                  <div className="flex items-center">
                    <div className="flex flex-col">
                      <div className="flex-auto text-xs text-ternary my-1">
                        <span className="mr-1">
                          {getDayShortName(ticket?.date)}
                        </span>
                        <span>{formatDateToDayMonth(ticket?.date)}</span>
                      </div>
                      <div className="w-full flex-none text-lg text-secondary font-bold leading-none">
                        {getCityShortForm(ticket.route.startCity)}
                      </div>
                      <div className="text-xs">{ticket.route?.startCity}</div>
                    </div>
                    <div className="flex flex-col mx-auto">
                      <img
                        src={`https://www.freeiconspng.com/uploads/bus-png-${
                          Math.floor(Math.random() * 5) + 1
                        }.png`}
                        className="h-14 p-1"
                        alt="Bus Logo"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex-auto text-xs text-ternary my-1">
                        <span className="mr-1">
                          {ticket?.date
                            ? getDayShortName(new Date(ticket.date))
                            : "N/A"}
                        </span>
                        <span>{formatDateToDayMonth(ticket.date)}</span>
                      </div>
                      <div className="w-full flex-none text-lg text-secondary font-bold leading-none">
                        {getCityShortForm(ticket.route.endCity)}
                      </div>
                      <div className="text-xs">{ticket.route?.endCity}</div>
                    </div>
                  </div>
                  <div className=" border-dashed border-b-2 my-5 pt-5 relative">
                    <div className="absolute rounded-full w-5 h-5 bg-primary -mt-2 -left-2"></div>
                    <div className="absolute rounded-full w-5 h-5 bg-primary -mt-2 -right-2"></div>
                  </div>
                  <div className="flex items-center mb-5 p-5 text-sm">
                    <div className="flex flex-col">
                      <span className="text-sm">Bus Number</span>
                      <div className="font-semibold">
                        {ticket.busDetails?.busNumber}
                      </div>
                    </div>
                    <div className="flex flex-col ml-auto">
                      <span className="text-sm">Gate</span>
                      <div className="font-semibold">B3</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-4 px-5">
                    <div className="flex flex-col text-sm">
                      <span>Departure</span>
                      <div className="font-semibold">
                        {formatTime(ticket?.departureTime)}
                      </div>
                    </div>
                    <div className="flex flex-col text-sm">
                      <span>Arrival</span>
                      <div className="font-semibold">
                        {formatTime(ticket?.arrivalTime)}
                      </div>
                    </div>
                  </div>
                  <div className="border-dashed border-b-2 my-5 pt-5 relative">
                    <div className="absolute rounded-full w-5 h-5 bg-primary -mt-2 -left-2"></div>
                    <div className="absolute rounded-full w-5 h-5 bg-primary -mt-2 -right-2"></div>
                  </div>
                  <div className="flex items-center px-5 pt-3 text-sm">
                    <div className="flex flex-col">
                      <span>Passenger</span>
                      <div className="font-semibold">{ticket?.user}</div>
                    </div>
                    <div className="flex flex-col mx-auto">
                      <span>Class</span>
                      <div className="font-semibold">
                        {ticket.busDetails.standard.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span>Seat</span>
                      <div className="font-semibold">
                        {extractSeatNumber(ticket.seatNumber)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col py-5 justify-center text-sm">
                    <h6 className="text-ternary text-center text-sm">
                      Show this to driver in the bus
                    </h6>
                    <div className="barcode h-14 w-0 inline-block mt-4 relative left-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketCard;
