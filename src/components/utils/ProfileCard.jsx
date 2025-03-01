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
    <div className="mt-4 flex justify-center items-center">
      <div className="mx-4 w-full lg:w-1/2 bg-primary rounded-3xl shadow">
        <div className="h-1/2 w-full flex justify-between items-center p-4">
          <h1 className="text-main">Profile Settings</h1>
          <FaUserEdit className="text-2xl text-white" />
        </div>

        <div className="bg-main w-full rounded-3xl flex flex-col justify-around items-center">
          {["name", "email", "phoneNumber"].map((field) => (
            <div key={field} className="w-full px-4 mb-4">
              <label
                htmlFor={`edit-${field}`}
                className="text-ternary text-sm capitalize"
              >
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <div className="flex items-center border border-ternary_light rounded-full px-4 py-2 bg-white">
                {editMode[field] ? (
                  <input
                    id={`edit-${field}`}
                    type={field === "email" ? "email" : "text"}
                    value={updatedData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="w-full px-2 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0"
                  />
                ) : (
                  <span className="w-full px-2 text-gray-700">
                    {updatedData[field]}
                  </span>
                )}
                <div className="px-1 flex justify-center items-center gap-2">
                  {editMode[field] ? (
                    <>
                      <button
                        onClick={() => handleSave(field)}
                        disabled={isSaving}
                        className="text-green-500"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleCancel(field)}
                        className="text-red-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <MdEdit
                      className="cursor-pointer"
                      onClick={() => handleEditToggle(field)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
      <ChangePasswordComponent />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
