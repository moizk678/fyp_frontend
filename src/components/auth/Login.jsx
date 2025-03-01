import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../api/AuthenticationApi";
import Loader from "../utils/Loader";
import { useDispatch } from "react-redux";
import { initializeStore } from "../../store/intializeStore";
import { FaBus, FaEnvelope, FaLock } from "react-icons/fa";
import { apiBaseUrl } from "../api/settings";
import PurpleBus from "../../assets/ppb.jpg"; // Adjusted path


function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!email || !password) {
        toast.error("Please enter both email and password.");
        setIsLoading(false);
        return;
      }

      const data = { email, password };
      const result = await loginUser(data);

      if (result.success) {
        const { data } = result;
        window.localStorage.setItem("token", data.token);
        await initializeStore(dispatch, apiBaseUrl);
        navigate("/");
        toast.success(data.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="px-4 lg:px-0 grid grid-cols-1 md:grid-cols-2 h-screen 
        bg-gradient-to-r from-purple-900 via-violet-700 to-indigo-500"
    >

{/* Left Side Image */}
<div className="hidden md:block">
  <img
    src={PurpleBus}
    className="object-contain w-full h-full brightness-75 mx-auto"
    alt="purple-bus"
  />
</div>



      {/* Right Side Login Form */}
      <div className="flex justify-center items-center">
        <form
          className="border border-gray-300 shadow-xl backdrop-blur-lg bg-white/15 p-8 w-full max-w-md 
          rounded-xl transition-all duration-300 ease-in-out hover:scale-105 animate-fade-in"
          onSubmit={handleSubmit}
        >
          {/* Logo & Title */}
          <div className="flex items-center justify-center mb-4">
            <FaBus className="text-4xl text-yellow-300 animate-bounce mr-2" />
            <span className="text-yellow-300 text-3xl font-bold">Tap & Travel</span>
          </div>
          <h2 className="text-lg text-white italic text-center mb-4">
            Journey Bright, Day or Night
          </h2>

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-white font-semibold mb-1">
              Email
            </label>
            <div className="flex items-center border border-gray-400 rounded-full px-4 py-2 
                bg-white/20 focus-within:border-yellow-400 transition-all text-white">
              <FaEnvelope className="text-yellow-300 mr-2" />
              <input
                className="w-full bg-transparent outline-none placeholder-white/80"
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter Your Email"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-white font-semibold mb-1">
              Password
            </label>
            <div className="flex items-center border border-gray-400 rounded-full px-4 py-2 
                bg-white/20 focus-within:border-yellow-400 transition-all text-white">
              <FaLock className="text-yellow-300 mr-2" />
              <input
                className="w-full bg-transparent outline-none placeholder-white/80"
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter Your Password"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full py-2 w-full
                transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader className="animate-spin" />
                <span className="ml-2">Logging in...</span>
              </div>
            ) : (
              "Log In"
            )}
          </button>

          {/* Signup Redirect */}
          <p className="text-center text-white mt-4 italic">
            Don’t have an account yet?
          </p>
          <button
            className="mt-2 border border-white text-white hover:bg-white hover:text-purple-900 
                font-semibold rounded-full py-2 w-full transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
