/* eslint-disable react/prop-types */

const CompanyCard = ({ company }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 m-4 max-h-fit">
      <img
        src="https://i.pinimg.com/736x/56/1a/fe/561afeafc2b10e75c616b55341fa835d.jpg"
        alt=""
      />
      <h2 className="text-xl font-semibold mb-2">{company?.name}</h2>
      <p className="text-gray-600 mb-2">Company: {company?.company}</p>
      <p className="text-gray-600 mb-2">
        Registered Buses: {company?.totalBuses}
      </p>

      <p className="text-slate-200 bg-green-700 p-2 rounded-full text-center mb-2">
        Cotact at: {company?.email}
      </p>
    </div>
  );
};

export default CompanyCard;
