/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { apiBaseUrl } from "../api/settings";
import { pakistanCities } from "./data";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import Loader from "./Loader";
import { useSelector } from "react-redux";

const OrderCard = () => {
  const user = useSelector((state) => state.user.data);
  const status = useSelector((state) => state.user.status);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    province: "",
    city: "",
    postalCode: "",
    address: "",
  });
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const uniqueProvinces = [
      ...new Set(Object.values(pakistanCities).map((city) => city.province)),
    ];
    setProvinces(uniqueProvinces);
  }, []);

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setFormData({ ...formData, province: selectedProvince, city: "" });

    // Filter cities based on the selected province
    const citiesInProvince = Object.values(pakistanCities)
      .filter((city) => city.province === selectedProvince)
      .map((city) => city.name);
    setCities(citiesInProvince);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    const decodedToken = jwtDecode(localStorage.getItem("token"));
    e.preventDefault();

    const patchData = {
      email: decodedToken?.email,
      address: formData,
      RFIDCardStatus: "booked",
    };
    console.log("Address Form Data", patchData);

    try {
      const response = await fetch(`${apiBaseUrl}/user/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patchData),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Your RFID Card will be delivered soon to your address.");
        setIsModalOpen(false);
      } else {
        alert("Error updating profile: " + result.message);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleChangeAddressClick = () => {
    // Prefill the form with existing data
    if (user) {
      setFormData({
        province: user?.address?.province || "",
        city: user?.address?.city || "",
        postalCode: user?.address?.postalCode || "",
        address: user?.address?.address || "",
      });
      setIsModalOpen(true);
    }
  };

  return (
    <div className="mx-auto">
      <div className="flex flex-col justify-center gap-2 items-center m-2">
        {user.RFIDCardStatus === "booked" ? (
          <>
            <h1>
              Your RFID Card Will Be Delivered Soon to {user.address.address}.
            </h1>
          </>
        ) : user.RFIDCardStatus === "delivered" ? (
          <h1>Your RFID Card has been delivered to {user.address.address}.</h1>
        ) : (
          <h1>Order FREE RFID Card for our premier Services.</h1>
        )}

        {/* Loading state check */}
        {status === "loading" ? (
          <Loader /> // Show loading text or spinner
        ) : (
          <>
            {/* Button Logic based on RFIDCardStatus */}
            {user.RFIDCardStatus === "booked" ? (
              <>
                <button onClick={handleChangeAddressClick} className="app-btn">
                  Change Address
                </button>
              </>
            ) : user.RFIDCardStatus === "delivered" ? (
              <button className="app-btn" disabled>
                Your Card Has Been Delivered
              </button>
            ) : (
              <button onClick={() => setIsModalOpen(true)} className="app-btn">
                Order My Card
              </button>
            )}
          </>
        )}
        <img
          className="rounded-xl mt-2"
          src="https://cdn11.bigcommerce.com/s-ypkdkc2suf/product_images/uploaded_images/access-control-prox-proxy-cards.png"
          alt=""
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-primary p-6 rounded-xl w-96">
            <h2 className="text-xl text-center text-white font-bold mb-4">
              Enter Your Address
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-white text-xl font-semibold mb-2">
                  Province
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleProvinceChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                >
                  <option value="">Select Province</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Dropdown */}
              <div className="mb-4">
                <label className="block text-white text-xl font-semibold mb-2">
                  City
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                  disabled={!formData.province}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-white text-xl font-semibold mb-2">
                  Postal Code
                </label>
                <input
                  type="number"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  max="99999"
                  min="0"
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-white text-xl font-semibold mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 text-gray-500"
                >
                  Cancel
                </button>
                <button type="submit" className="app-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
