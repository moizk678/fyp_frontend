import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen overflow-y-auto">
      <Navbar />
      <div className="flex-grow p-4">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
