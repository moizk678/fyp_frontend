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
    <nav className="bg-primary text-white top-0 left-0 w-full px-4 py-3">
      <div className="mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center ml-2">
          <IoBus className="text-2xl lg:mt-1" />
          <span className="text-white font-bold text-lg ml-2">
            Tap & Travel
          </span>
        </Link>
        <div className="lg:hidden">
          {/* Hamburger Icon */}
          <button
            className="text-white hover:text-gray-300 mt-2 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <svg
              className="w-6 h-6"
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
          <NavLink to="/bookings" className="flex items-center gap-4">
            <FaTicket />
            <span>Tickets</span>
          </NavLink>
          <NavLink to="/rfid-card" className="flex items-center gap-4">
            <RiRfidLine />
            <span>RFID Card</span>
          </NavLink>
          <NavLink to="/companies" className="flex items-center gap-4">
            <BsBuildingsFill />
            <span>Companies</span>
          </NavLink>
          <NavLink to="/map" className="flex items-center gap-4">
            <FaLocationDot />
            <span>GPS Tracking</span>
          </NavLink>
          <Dropdown />
        </div>
      </div>
      {/* Mobile Menu */}
      <div
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } fixed top-0 right-0 h-full w-1/2 bg-primary py-4 pl-1 transition-transform duration-300 ease-in-out transform z-50 lg:hidden`}
      >
        <div className="h-[80vh] grid grid-rows-[auto,auto]">
          <div>
            <ul className="space-y-4 w-full">
              <li className="app-side-li">
                <NavLink to="/" className="flex items-center gap-4">
                  <IoMdHome />
                  <span>Home</span>
                </NavLink>
              </li>
              <li className="app-side-li">
                <NavLink to="/companies" className="flex items-center gap-4">
                  <BsBuildingsFill />
                  <span>Companies</span>
                </NavLink>
              </li>
              <li className="app-side-li">
                <NavLink to="/bookings" className="flex items-center gap-4">
                  <FaTicket />
                  <span>Tickets</span>
                </NavLink>
              </li>
              <li className="app-side-li">
                <NavLink to="/rfid-card" className="flex items-center gap-4">
                  <RiRfidLine />
                  <span>RFID Card</span>
                </NavLink>
              </li>
              <li className="app-side-li">
                <NavLink to="/companies" className="flex items-center gap-4">
                  <FaLocationDot />
                  <span>GPS Tracking</span>
                </NavLink>
              </li>
              <li className="app-side-li">
                <NavLink to="/profile" className="flex items-center gap-4">
                  <FaUser />
                  <span>My Profile</span>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="px-4 flex flex-col-reverse">
            <NavLink to="/login" className="app-nav-li">
              <BiLogOutCircle />
              <span className="text-white hover:text-primary">Logout</span>
            </NavLink>
          </div>
        </div>
      </div>
      {/* Dark Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
