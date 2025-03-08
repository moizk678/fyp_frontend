/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { apiBaseUrl } from "../api/settings";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

const CheckOutForm = ({ amount, busId, userId, adminId, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const user = useSelector((state) => state.user.data);

  useEffect(() => {
    if (showDiscount) {
      const duration = 3000;
      const end = Date.now() + duration;
      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [showDiscount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const { data } = await axios.post(
        `${apiBaseUrl}/payment/create-payment-intent`,
        { amount, busId, userId, adminId }
      );

      const clientSecret = data.clientSecret;
      const cardElement = elements.getElement(CardElement);

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: { name: user.name },
          },
        }
      );

      if (error) {
        setError(error.message);
      } else if (paymentIntent.status === "succeeded") {
        onPaymentSuccess(paymentIntent);
        toast.success("✅ Payment successful!");
        setShowDiscount(true);
        setTimeout(() => {
          setShowDiscount(false);
        }, 3000);
        await axios.post(`${apiBaseUrl}/payment/update-status`, {
          paymentId: paymentIntent.id,
          status: "succeeded",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 via-violet-700 to-indigo-900 p-6 relative">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg shadow-2xl border border-white/20 rounded-3xl p-10 animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          💳 Complete Your Payment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Input Section */}
          <div className="p-5 border border-gray-400 bg-gray-900/70 text-white rounded-xl shadow-md focus-within:ring-2 focus-within:ring-yellow-400">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "18px",
                    color: "#ffffff",
                    "::placeholder": { color: "#aab7c4" },
                  },
                  invalid: { color: "#ff4d4d" },
                },
              }}
            />
          </div>

          {/* Error Message Display */}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          {/* Pay Now Button */}
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-500 transition-transform transform hover:scale-105 shadow-lg disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "💰 Pay Now"}
          </button>
        </form>
      </div>

      {/* Discount Message Overlay */}
      {showDiscount && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
          <h2 className="text-3xl font-bold text-white mb-4">Congratulations!</h2>
          <p className="text-xl text-white">Enjoy a 10% discount on your next ride!</p>
        </div>
      )}
    </div>
  );
};

export default CheckOutForm;