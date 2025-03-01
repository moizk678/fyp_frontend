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
    <div className="relative font-[sans-serif] w-max mx-auto" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="rounded text-white border-none outline-none flex items-center"
      >
        <MdAccountCircle className="text-xl mr-2" />
        Account
        <RiArrowDropDownLine className="text-3xl" />
      </button>

      {isDropdownOpen && (
        <ul className="absolute flex-col items-center justify-center block shadow-lg bg-white py-2 z-[1000] min-w-full rounded-lg max-h-96 overflow-auto">
          <Link to="/profile">
            <li className="py-1 flex items-center justify-center gap-2 hover:bg-blue-50 text-black text-sm cursor-pointer">
              <MdEdit />
              Profile
            </li>
          </Link>
          <NavLink
            to="/login"
            onClick={handleLogout}
            className="py-1 flex items-center justify-center gap-2 hover:bg-blue-50 text-black text-sm cursor-pointer"
          >
            <RiLogoutCircleLine /> Logout
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
