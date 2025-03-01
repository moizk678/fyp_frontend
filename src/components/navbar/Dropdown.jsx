/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { MdEdit, MdAccountCircle } from "react-icons/md";
import { RiLogoutCircleLine, RiArrowDropDownLine } from "react-icons/ri";
import { useNavigate, Link, NavLink } from "react-router-dom";

const Dropdown = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("User Logged out Successfully");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-max mx-auto" ref={dropdownRef}>
      {/* Account Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="rounded text-white flex items-center hover:text-yellow-300 transition-all"
      >
        <MdAccountCircle className="text-2xl mr-1" />
        Account
        <RiArrowDropDownLine className="text-3xl" />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <ul
          className="absolute right-0 mt-2 w-40 shadow-lg bg-gradient-to-b from-purple-900 to-violet-700 text-white 
          py-2 z-[1000] rounded-lg max-h-96 overflow-auto transition-all duration-200 ease-in-out transform scale-95 origin-top"
        >
          <Link to="/profile">
            <li className="py-2 px-4 flex items-center gap-2 hover:bg-purple-800 cursor-pointer transition-all">
              <MdEdit className="text-yellow-300" />
              Profile
            </li>
          </Link>
          <NavLink
            to="/login"
            onClick={handleLogout}
            className="py-2 px-4 flex items-center gap-2 hover:bg-purple-800 cursor-pointer transition-all"
          >
            <RiLogoutCircleLine className="text-yellow-300" /> Logout
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
