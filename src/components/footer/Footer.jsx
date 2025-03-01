import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-primary py-4">
      <p className="text-center text-white mb-2 ">
        &copy;2024 Tap & Travel. All rights reserved.
      </p>
      <div className="flex justify-center items-center space-x-6">
        {/* Facebook Icon */}
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook size={30} className="text-white hover:text-gray-400" />
        </a>

        {/* Instagram Icon */}
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram size={30} className="text-white hover:text-gray-400" />
        </a>

        {/* Twitter Icon */}
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter size={30} className="text-white hover:text-gray-400" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
