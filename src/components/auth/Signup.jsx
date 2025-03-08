import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signUpUser } from "../api/AuthenticationApi";
import Loader from "../utils/Loader";
import { FaBus, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import PurpleBus from "../../assets/ppb.jpg"; // Adjusted path


function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim inputs and normalize email
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    // Basic validation for empty fields
    if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword || !trimmedPhone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const data = {
      email: trimmedEmail,
      password: trimmedPassword,
      name: trimmedName,
      phoneNumber: trimmedPhone,
    };

    try {
      setIsLoading(true);
      const result = await signUpUser(data);
      if (result.success) {
        // Storing email for OTP verification.
        localStorage.setItem("email", result.data.email);
        toast.success(result.data.message || "Signup successful!");
        navigate("/otp-verification");
      } else {
        toast.error(result.message || "Signup failed. Please check your details.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMsg =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Something went wrong. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 lg:px-0 grid grid-cols-1 md:grid-cols-2 h-screen bg-gradient-to-r from-purple-900 via-violet-700 to-indigo-500">
      {/* Left Side Image */}
      <div className="hidden md:block">
        <img
          src={PurpleBus}
          className="object-contain w-full h-full brightness-75 mx-auto"
          alt="purple-bus"
        />
      </div>

      {/* Right Side Signup Form */}
      <div className="flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="border border-gray-300 shadow-xl backdrop-blur-lg bg-white/15 p-6 w-full lg:w-2/3 max-w-md rounded-xl transition-all duration-300 ease-in-out hover:scale-105 animate-fade-in my-auto"
        >
          {/* Logo & Title */}
          <div className="flex items-center justify-center mb-4">
            <FaBus className="text-3xl text-yellow-300 animate-bounce mr-2" />
            <span className="text-yellow-300 text-2xl font-bold">Tap & Travel</span>
          </div>
          <h2 className="text-base text-white italic text-center mb-4">Journey Bright, Day or Night</h2>

          {/* Full Name */}
          <div className="mb-3">
            <label htmlFor="name" className="block text-white font-semibold mb-1 text-sm">
              Full Name
            </label>
            <div className="flex items-center border border-gray-400 rounded-full px-3 py-1.5 bg-white/20 focus-within:border-yellow-400 transition-all text-white">
              <FaUser className="text-yellow-300 mr-2" />
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter Your Full Name"
                className="w-full bg-transparent outline-none placeholder-white/80 text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="block text-white font-semibold mb-1 text-sm">
              Email
            </label>
            <div className="flex items-center border border-gray-400 rounded-full px-3 py-1.5 bg-white/20 focus-within:border-yellow-400 transition-all text-white">
              <FaEnvelope className="text-yellow-300 mr-2" />
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter Your Email"
                className="w-full bg-transparent outline-none placeholder-white/80 text-sm"
              />
            </div>
          </div>

          {/* Password & Confirm Password */}
          {[
            ["Password", password, setPassword, showPassword, togglePasswordVisibility, "password"],
            ["Confirm Password", confirmPassword, setConfirmPassword, showConfirmPassword, toggleConfirmPasswordVisibility, "confirm-password"],
          ].map(([label, value, setter, show, toggle, id], index) => (
            <div key={index} className="mb-3">
              <label htmlFor={id} className="block text-white font-semibold mb-1 text-sm">
                {label}
              </label>
              <div className="flex items-center border border-gray-400 rounded-full px-3 py-1.5 bg-white/20 focus-within:border-yellow-400 transition-all text-white relative">
                <FaLock className="text-yellow-300 mr-2" />
                <input
                  type={show ? "text" : "password"}
                  id={id}
                  name={id}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  required
                  placeholder={`Enter ${label}`}
                  className="w-full bg-transparent outline-none placeholder-white/80 text-sm pr-8"
                />
                <button type="button" onClick={toggle} className="absolute right-3 text-yellow-300 text-xs">
                  {show ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          ))}

          {/* Phone Number */}
          <div className="mb-3">
            <label htmlFor="phone" className="block text-white font-semibold mb-1 text-sm">
              Phone Number
            </label>
            <div className="flex items-center border border-gray-400 rounded-full px-3 py-1.5 bg-white/20 focus-within:border-yellow-400 transition-all text-white">
              <FaPhone className="text-yellow-300 mr-2" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Enter Your Phone Number"
                className="w-full bg-transparent outline-none placeholder-white/80 text-sm"
              />
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full py-2 w-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          >
            {isLoading ? <Loader /> : "Sign Up"}
          </button>

          {/* Back to Login Button */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-3 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold rounded-full py-2 w-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Back to Login Page
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;