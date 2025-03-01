import { NavLink, Link, useNavigate } from "react-router-dom";
import { VscTarget } from "react-icons/vsc";
import { BiLogOutCircle } from "react-icons/bi";
import { IoMdHome } from "react-icons/io";
import { BsBuildingsFill } from "react-icons/bs";
import { FaBusAlt } from "react-icons/fa";
import { FaRoute, FaTicket } from "react-icons/fa6";
import { LiaUserEditSolid } from "react-icons/lia";
import toast from "react-hot-toast";

const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("User Logged out Successfully");
  };
  return (
    <div className="w-1/6 sidebar-height bg-headline sticky top-0 px-2 py-4 shadow-md">
      <Link to="/">
        <div className="flex items-center justify-center font-bold mb-4">
          <VscTarget />
          <span className="text-black text-lg ml-2">Menu</span>
        </div>
      </Link>
      <div className="flex-col justify-end border-t-2 font-bold my-4"></div>

      <div className="h-[70vh] grid grid-rows-[auto,auto]">
        <div>
          <ul className="space-y-4 w-full">
            <li className="app-side-li">
              <NavLink to="/" className="flex items-center gap-4">
                <IoMdHome />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li className="app-side-li">
              <NavLink to="/companies" className="flex items-center gap-4">
                <BsBuildingsFill />
                <span>Companies</span>
              </NavLink>
            </li>
            <li className="app-side-li">
              <NavLink to="/buses" className="flex items-center gap-4">
                <FaBusAlt />
                <span>Buses</span>
              </NavLink>
            </li>
            <li className="app-side-li">
              <NavLink to="/bookings" className="flex items-center gap-4">
                <FaTicket />
                <span>Bookings</span>
              </NavLink>
            </li>
            <li className="app-side-li">
              <NavLink to="/map" className="flex items-center gap-4">
                <FaRoute />
                <span>GPS Tracking</span>
              </NavLink>
            </li>
            <li className="app-side-li">
              <NavLink to="/profile" className="flex items-center gap-4">
                <LiaUserEditSolid />
                <span>Profile</span>
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="px-4 flex flex-col-reverse ">
          <NavLink
            to="/login"
            onClick={handleLogout}
            className="flex items-center gap-4 app-side-li"
          >
            <BiLogOutCircle />
            <span>Logout</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
