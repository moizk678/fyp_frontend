import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-violet-700 to-indigo-500 py-6">
      <p className="text-center text-white text-sm md:text-base mb-3 font-light">
        &copy; 2024 Tap & Travel. All rights reserved.
      </p>
      <div className="flex justify-center items-center space-x-6">
        {/* Facebook Icon */}
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform transform hover:scale-110"
        >
          <FaFacebook size={30} className="text-white hover:text-yellow-300 transition-all" />
        </a>

        {/* Instagram Icon */}
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform transform hover:scale-110"
        >
          <FaInstagram size={30} className="text-white hover:text-yellow-300 transition-all" />
        </a>

        {/* Twitter Icon */}
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform transform hover:scale-110"
        >
          <FaTwitter size={30} className="text-white hover:text-yellow-300 transition-all" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
