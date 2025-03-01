/* eslint-disable no-unused-vars */
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { BiSolidDashboard, BiLogOutCircle } from "react-icons/bi";
import { FaBusAlt } from "react-icons/fa";
import { IoBus } from "react-icons/io5";
import { IoMdHome } from "react-icons/io";
import { BsBuildingsFill, BsMicrosoftTeams } from "react-icons/bs";
import { FaUser, FaRoute } from "react-icons/fa6";
import { MdPayment, MdContactSupport } from "react-icons/md";
import { VscTarget } from "react-icons/vsc";
import { FaTicket, FaLocationDot } from "react-icons/fa6";
import { LiaUserEditSolid } from "react-icons/lia";
import { RiRfidLine } from "react-icons/ri";
import Dropdown from "./Dropdown";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-violet-700 to-indigo-500 text-white fixed top-0 left-0 w-full px-6 py-3 shadow-md z-50">
      <div className="mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center ml-2">
          <IoBus className="text-3xl text-yellow-300 animate-pulse" />
          <span className="text-yellow-300 font-bold text-xl ml-2 tracking-wide">
            Tap & Travel
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            className="text-white hover:text-yellow-300 transition-all focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Horizontal Menu for Large Screens */}
        <div className="hidden lg:flex space-x-6">
          <NavLink to="/bookings" className="flex items-center gap-3 hover:text-yellow-300 transition-all">
            <FaTicket />
            <span>Tickets</span>
          </NavLink>
          <NavLink to="/rfid-card" className="flex items-center gap-3 hover:text-yellow-300 transition-all">
            <RiRfidLine />
            <span>RFID Card</span>
          </NavLink>
          <NavLink to="/companies" className="flex items-center gap-3 hover:text-yellow-300 transition-all">
            <BsBuildingsFill />
            <span>Companies</span>
          </NavLink>
          <NavLink to="/map" className="flex items-center gap-3 hover:text-yellow-300 transition-all">
            <FaLocationDot />
            <span>GPS Tracking</span>
          </NavLink>
          <Dropdown />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-2/3 bg-gradient-to-b from-purple-900 to-violet-700 py-6 pl-5 transition-transform duration-300 ease-in-out transform z-50 lg:hidden shadow-lg ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-[80vh] grid grid-rows-[auto,auto]">
          <div>
            <ul className="space-y-4 w-full">
              <li className="app-side-li">
                <NavLink to="/" className="flex items-center gap-3 hover:text-yellow-300 transition-all">
                  <IoMdHome />
                  <span>Home</span>
                </NavLink>
              </li>
              <li className="app-side-li">
                <NavLink to="/companies" className="flex items-center gap-3 hover:text-yellow-300 transition-all">
                  <BsBuildingsFill />
                  <span>Companies</span>
                </NavLink>
              </li>
              <li className="app-side-li">
                <NavLink to="/bookings" className="flex items-center gap-3 hover:text-yellow-300 transition-all">
                  <FaTicket />
                  <span>Tickets</span>
                </NavLink>
              </li>
              <li className="app-side-li">
                <NavLink to="/rfid-card" className="flex items-center gap-3 hover:text-yellow-300 transition-all">
                  <RiRfidLine />
                  <span>RFID Card</span>
                </NavLink>
              </li>
              <li className="app-side-li">
                <NavLink to="/map" className="flex items-center gap-3 hover:text-yellow-300 transition-all">
                  <FaLocationDot />
                  <span>GPS Tracking</span>
                </NavLink>
              </li>
              <li className="app-side-li">
                <NavLink to="/profile" className="flex items-center gap-3 hover:text-yellow-300 transition-all">
                  <FaUser />
                  <span>My Profile</span>
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Logout Button */}
          <div className="px-4 flex flex-col-reverse">
            <NavLink to="/login" className="app-nav-li flex items-center gap-3 text-white hover:text-yellow-300 transition-all">
              <BiLogOutCircle className="text-xl" />
              <span>Logout</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Dark Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black opacity-50 transition-opacity" onClick={toggleMobileMenu}></div>
      )}
    </nav>
  );
};

export default Navbar;
