import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaBus } from "react-icons/fa";
import Loader from "../utils/Loader";
import { apiBaseUrl } from "../api/settings";
import { initializeStore } from "../../store/intializeStore";
import { useDispatch } from "react-redux";
import PurpleBus from "../../assets/ppb.jpg"; // Adjusted path


function OTPVerification() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleKeyDown = (e, index) => {
    if (!/^[0-9]{1}$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
      e.preventDefault();
    }
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      if (otp[index] !== "") {
        setOtp((prevOtp) => [...prevOtp.slice(0, index), "", ...prevOtp.slice(index + 1)]);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
        setOtp((prevOtp) => [...prevOtp.slice(0, index - 1), "", ...prevOtp.slice(index)]);
      }
    }
  };

  const handleInput = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value) {
      setOtp((prevOtp) => [...prevOtp.slice(0, index), value, ...prevOtp.slice(index + 1)]);
      if (index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, otp.length);
    if (/^[0-9]+$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp((prevOtp) => [...newOtp, ...prevOtp.slice(newOtp.length)]);
      if (newOtp.length === otp.length) {
        inputRefs.current[otp.length - 1].focus();
      }
    }
  };

  const handleFocus = (e) => e.target.select();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      toast.error("Please enter a 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: localStorage.getItem("email"),
          otp: otpValue,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const { message, token } = data;
        window.localStorage.setItem("token", token);
        await initializeStore(dispatch, apiBaseUrl);
        toast.success(message);
        navigate("/");
      } else {
        toast.error("OTP verification failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 lg:px-0 grid grid-cols-1 md:grid-cols-2 h-screen 
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

      {/* Right Side OTP Form */}
      <div className="flex justify-center items-center">
        <form
          className="border border-gray-300 shadow-xl backdrop-blur-lg bg-white/15 p-6 w-full lg:w-2/3
          max-w-md rounded-xl transition-all duration-300 ease-in-out hover:scale-105 animate-fade-in my-auto"
          onSubmit={handleSubmit}
        >
          {/* Logo & Title */}
          <div className="flex items-center justify-center mb-4">
            <FaBus className="text-3xl text-yellow-300 animate-bounce mr-2" />
            <span className="text-yellow-300 text-2xl font-bold">Tap & Travel</span>
          </div>
          <h2 className="text-base text-white italic text-center mb-4">
            Enter the 6-digit verification code sent to your email.
          </h2>

          {/* OTP Input Fields */}
          <div className="flex items-center justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={handleFocus}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-2xl font-bold text-white bg-white/20 
                border border-gray-400 hover:border-yellow-400 rounded-lg outline-none 
                focus:bg-white/30 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full py-2 w-full
                transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : "Verify Account"}
          </button>

          {/* Back to Login Button */}
          <button
            className="mt-3 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black 
                font-semibold rounded-full py-2 w-full transition duration-300 ease-in-out transform hover:scale-105"
            type="button"
            onClick={() => navigate("/login")}
          >
            Back to Login Page
          </button>
        </form>
      </div>
    </div>
  );
}

export default OTPVerification;
