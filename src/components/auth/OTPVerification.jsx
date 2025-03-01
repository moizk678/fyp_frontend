/* eslint-disable no-unused-vars */
import { FaBus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../utils/Loader";
import { apiBaseUrl } from "../api/settings";
import { initializeStore } from "../../store/intializeStore";
import { useDispatch } from "react-redux";

function OTPVerification() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleKeyDown = (e, index) => {
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete"
    ) {
      e.preventDefault();
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      if (otp[index] !== "") {
        setOtp((prevOtp) => [
          ...prevOtp.slice(0, index),
          "",
          ...prevOtp.slice(index + 1),
        ]);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
        setOtp((prevOtp) => [
          ...prevOtp.slice(0, index - 1),
          "",
          ...prevOtp.slice(index),
        ]);
      }
    }
  };

  const handleInput = (e, index) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value) {
      setOtp((prevOtp) => [
        ...prevOtp.slice(0, index),
        value,
        ...prevOtp.slice(index + 1),
      ]);
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
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className="px-4 lg:px-0 grid grid-cols-1 md:grid-cols-2 overflow-hidden h-screen bg-main bg-[url('https://images.pexels.com/photos/4502111/pexels-photo-4502111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] lg:bg-none">
      <div className="hidden md:block">
        <img
          src="https://images.unsplash.com/photo-1543859184-17ac017dde53?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="object-cover w-full h-full"
          alt="signup-illustration"
        />
      </div>

      <div className="flex justify-center max-h-screen">
        <form
          className="border-primary border-solid border-2 w-full lg:w-2/3 rounded-lg h-fit my-auto px-4 lg:px-10 py-5"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center justify-center">
            <FaBus className="text-2xl text-primary mr-2" />
            <span className="text-primary text-2xl text-center font-bold mb-0.5">
              Tap & Travel
            </span>
          </div>
          <h2 className="text-xl italic font-bold text-center mb-0.5">
            Journey Bright, Day or Night
          </h2>

          <p className="text-center text-[15px] text-slate-500 mb-4">
            Enter the 6-digit verification code sent to your email.
          </p>

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
                className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-primary px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : "Verify Account"}
          </button>

          <h3 className="text-lg text-center mt-4">
            Already have an account?{" "}
            <NavLink to="/login" className="font-bold underline italic">
              Login Page
            </NavLink>
          </h3>
        </form>
      </div>
    </div>
  );
}

export default OTPVerification;
