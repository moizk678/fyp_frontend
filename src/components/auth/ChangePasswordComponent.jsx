import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { apiBaseUrl } from "../api/settings";
import { useSelector } from "react-redux";
import { FaUnlockAlt } from "react-icons/fa";
import { FaKey } from "react-icons/fa";

const ChangePasswordComponent = () => {
  const user = useSelector((state) => state.user.data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [passwordRules, setPasswordRules] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const handleVerifyOldPassword = async () => {
    try {
      const response = await axios.post(`${apiBaseUrl}/user/verify-password`, {
        email: user.email,
        oldPassword,
      });
      if (response.status === 200 && response.data.verified) {
        setIsVerified(true);
        toast.success("Password verified successfully.");
      } else {
        setIsVerified(false);
        toast.error("Incorrect old password.");
      }
    } catch (error) {
      console.error("Failed to verify password:", error);
      toast.error("Failed to verify password.");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await axios.post(`${apiBaseUrl}/user/change-password`, {
        email: user.email,
        oldPassword,
        newPassword,
      });
      if (response.status === 200) {
        toast.success("Password changed successfully.");
        setIsModalOpen(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsVerified(false);
        setPasswordRules({
          length: false,
          uppercase: false,
          number: false,
          specialChar: false,
        });
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error("Failed to change password.");
    }
  };

  const validatePassword = (password) => {
    const rules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[\W]/.test(password),
    };
    setPasswordRules(rules);
  };

  return (
    <div>
      {/* Trigger Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-primary text-white py-2 px-4 rounded-full mb-4 flex justify-center items-center gap-2"
      >
        Change Password
        <FaUnlockAlt />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-full max-w-md bg-primary p-6 rounded-xl shadow-md relative">
            <button
              className="absolute top-2 right-2 text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              ✖
            </button>
            <h2 className="text-xl text-white text-center font-bold mb-4 flex justify-center items-center gap-2">
              Change Password <FaKey />
            </h2>

            {/* Old Password Field */}
            <div className="mb-4">
              <label className="block text-xl  text-white font-medium mb-2">
                Old Password
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                  disabled={isVerified}
                />
                <button
                  onClick={handleVerifyOldPassword}
                  className="bg-tertiary rounded-full text-white px-4 py-1"
                >
                  Verify
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div className="mb-4">
              <label className="block text-xl  text-white font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                disabled={!isVerified}
              />
            </div>

            {/* Password Validation Rules */}
            {isVerified && (
              <div className="mb-4">
                <h3 className="text-gray-700 font-medium mb-2">
                  Password Rules:
                </h3>
                <ul>
                  <li
                    className={`text-sm ${
                      passwordRules.length ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    ✔️ At least 8 characters
                  </li>
                  <li
                    className={`text-sm ${
                      passwordRules.uppercase
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    ✔️ At least one uppercase letter
                  </li>
                  <li
                    className={`text-sm ${
                      passwordRules.number ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    ✔️ At least one number
                  </li>
                  <li
                    className={`text-sm ${
                      passwordRules.specialChar
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    ✔️ At least one special character
                  </li>
                </ul>
              </div>
            )}

            {/* Confirm Password Field */}
            <div className="mb-4">
              <label className="block text-xl  text-white font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                disabled={!isVerified}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleChangePassword}
              className={
                isVerified
                  ? `w-full bg-tertiary rounded-full text-white py-2`
                  : `w-full bg-red-700 rounded-full text-white py-2`
              }
              disabled={!isVerified}
            >
              Change Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePasswordComponent;
