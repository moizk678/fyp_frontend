/* eslint-disable react/prop-types */
import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { apiBaseUrl } from "../api/settings";
import toast from "react-hot-toast";
import { capitalizeFirstLetter } from "./HelperFunctions";
import { useDispatch } from "react-redux";
import { updateUserData } from "../../store/slices/userSlice";
import ChangePasswordComponent from "../auth/ChangePasswordComponent";

const ProfileCard = ({ user }) => {
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    phoneNumber: false,
  });

  const [updatedData, setUpdatedData] = useState({
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleEditToggle = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleCancel = (field) => {
    setUpdatedData((prev) => ({ ...prev, [field]: user[field] }));
    setEditMode((prev) => ({ ...prev, [field]: false }));
    toast.info(`${capitalizeFirstLetter(field)} edit canceled.`);
  };

  const handleChange = (field, value) => {
    setUpdatedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (field) => {
    setIsSaving(true);
    try {
      await dispatch(
        updateUserData({
          apiBaseUrl,
          userId: user._id,
          updatedFields: { [field]: updatedData[field] },
        })
      ).unwrap();

      setEditMode((prev) => ({ ...prev, [field]: false }));
      toast.success(`${capitalizeFirstLetter(field)} updated successfully.`);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
          <FaUserEdit className="text-3xl text-indigo-600" />
        </div>

        {/* Profile Fields */}
        <div className="space-y-6">
          {["name", "email", "phoneNumber"].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-gray-600 text-sm capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                {editMode[field] ? (
                  <input
                    id={`edit-${field}`}
                    type={field === "email" ? "email" : "text"}
                    value={updatedData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="w-full bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none"
                  />
                ) : (
                  <span className="w-full text-gray-800">{updatedData[field]}</span>
                )}

                <div className="flex items-center gap-3">
                  {editMode[field] ? (
                    <>
                      <button
                        onClick={() => handleSave(field)}
                        disabled={isSaving}
                        className="text-green-500 hover:text-green-600 font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleCancel(field)}
                        className="text-red-500 hover:text-red-600 font-bold"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <MdEdit
                      className="cursor-pointer text-gray-500 hover:text-indigo-600"
                      onClick={() => handleEditToggle(field)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Change Password Section */}
        <div className="mt-8 flex justify-center">
          <ChangePasswordComponent />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
