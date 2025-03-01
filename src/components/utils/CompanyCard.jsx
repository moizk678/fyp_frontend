const CompanyCard = ({ company }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 m-4 border border-gray-300 hover:shadow-2xl transition-transform transform hover:scale-105">
      {/* Company Image */}
      <div className="mb-4">
        <img
          src="https://i.pinimg.com/736x/56/1a/fe/561afeafc2b10e75c616b55341fa835d.jpg"
          alt="Company Logo"
          className="w-full h-40 object-cover rounded-lg"
        />
      </div>

      {/* Company Info */}
      <h2 className="text-xl font-bold text-gray-900 text-center">{company?.name}</h2>
      <p className="text-gray-700 text-center text-sm mt-1">
        🏢 <span className="font-semibold">{company?.company}</span>
      </p>
      <p className="text-gray-700 text-center text-sm">
        🚌 <span className="font-semibold">{company?.totalBuses}</span> Registered Buses
      </p>

      {/* Contact Info */}
      <div className="mt-4 bg-gradient-to-r from-green-500 to-green-700 text-white text-sm font-medium p-2 rounded-lg text-center shadow-md">
        📧 Contact: {company?.email}
      </div>
    </div>
  );
};

export default CompanyCard;
