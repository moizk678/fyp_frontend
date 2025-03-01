import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { apiBaseUrl } from "../api/settings";
import { useSelector } from "react-redux";
import { FaUnlockAlt, FaKey } from "react-icons/fa";

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
        className="bg-purple-700 text-white py-2 px-6 rounded-full flex items-center justify-center gap-2 shadow-lg hover:bg-purple-800 transition-all"
      >
        Change Password <FaUnlockAlt />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
          <div className="w-full max-w-lg bg-white/20 backdrop-blur-lg border border-white/30 p-6 rounded-xl shadow-xl relative animate-fade-in transition-all">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-300 hover:text-white transition text-lg"
              onClick={() => setIsModalOpen(false)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold text-center text-white mb-6 flex items-center justify-center gap-2">
              Change Password <FaKey />
            </h2>

            {/* Old Password Field */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-white mb-2">
                Old Password
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-purple-400 bg-white/20 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  disabled={isVerified}
                />
                <button
                  onClick={handleVerifyOldPassword}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                  Verify
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-white mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                className="w-full px-4 py-3 border border-purple-400 bg-white/20 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                disabled={!isVerified}
              />
            </div>

            {/* Password Validation Rules */}
            {isVerified && (
              <div className="mb-5">
                <h3 className="text-white font-medium mb-2">Password Rules:</h3>
                <ul className="space-y-1">
                  <li className={`text-sm flex items-center gap-2 ${passwordRules.length ? "text-green-400" : "text-gray-400"}`}>
                    ✔️ At least 8 characters
                  </li>
                  <li className={`text-sm flex items-center gap-2 ${passwordRules.uppercase ? "text-green-400" : "text-gray-400"}`}>
                    ✔️ At least one uppercase letter
                  </li>
                  <li className={`text-sm flex items-center gap-2 ${passwordRules.number ? "text-green-400" : "text-gray-400"}`}>
                    ✔️ At least one number
                  </li>
                  <li className={`text-sm flex items-center gap-2 ${passwordRules.specialChar ? "text-green-400" : "text-gray-400"}`}>
                    ✔️ At least one special character
                  </li>
                </ul>
              </div>
            )}

            {/* Confirm Password Field */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-white mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-purple-400 bg-white/20 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                disabled={!isVerified}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleChangePassword}
              className={`w-full py-3 rounded-lg text-white font-bold shadow-md transition ${
                isVerified ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 cursor-not-allowed"
              }`}
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
