'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const OrderCard = ({ onSubmit }) => {
  const initialFormData = {
    fullName: '',
    email: '',
    province: '',
    city: '',
    postalCode: '',
    address: '',
  };

  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedData = sessionStorage.getItem('orderFormData');
      return savedData ? JSON.parse(savedData) : initialFormData;
    }
    return initialFormData;
  });

  const [orderPlaced, setOrderPlaced] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedOrderPlaced = sessionStorage.getItem('orderPlaced');
      return savedOrderPlaced ? JSON.parse(savedOrderPlaced) : false;
    }
    return false;
  });

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('orderFormData', JSON.stringify(formData));
    }
  }, [formData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('orderPlaced', JSON.stringify(orderPlaced));
    }
  }, [orderPlaced]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (orderPlaced || confirmModalOpen) return;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).some((value) => value.trim() === '')) {
      toast.error('All fields are required!');
      return;
    }
    setConfirmModalOpen(true);
  };

  const sendConfirmationEmail = async (email, orderData) => {
    try {
      const response = await fetch('/api/send-confirmation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, orderData }),
      });
      if (!response.ok) {
        throw new Error('Failed to send confirmation email.');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleConfirmYes = async () => {
    setConfirmModalOpen(false);
    setOrderPlaced(true);
    setIsModalOpen(true);
    toast.success('Your RFID Card order has been placed successfully!');
    onSubmit(formData);
    try {
      await sendConfirmationEmail(formData.email, formData);
    } catch (error) {
      toast.error('Confirmation email sending failed!');
    }
  };

  const handleConfirmNo = () => {
    setConfirmModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-300 relative">
      {!orderPlaced ? (
        <>
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-4 font-sans">
            Order Your RFID Card
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', name: 'fullName', type: 'text' },
              { label: 'Email', name: 'email', type: 'email' },
              { label: 'Province', name: 'province', type: 'text' },
              { label: 'City', name: 'city', type: 'text' },
              { label: 'Postal Code', name: 'postalCode', type: 'text' },
            ].map(({ label, name, type }) => (
              <div key={name} className="mb-3">
                <label className="block text-gray-700 font-semibold text-base mb-1 font-serif">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg bg-gray-100 shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-400 font-mono transition-all"
                  required
                  disabled={confirmModalOpen}
                />
              </div>
            ))}
            <div className="mb-3">
              <label className="block text-gray-700 font-semibold text-base mb-1 font-serif">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg bg-gray-100 shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-400 font-mono transition-all"
                required
                disabled={confirmModalOpen}
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-lg shadow-md hover:opacity-90 transition-all font-sans text-base"
                disabled={confirmModalOpen}
              >
                Order RFID Card
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center p-6">
          <h2 className="text-3xl font-bold text-green-600">Order Summary</h2>
          <p className="mt-4 text-gray-700">
            Your RFID Card order has been successfully placed.
          </p>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md text-left">
            <p><strong>Full Name:</strong> {formData.fullName}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Province:</strong> {formData.province}</p>
            <p><strong>City:</strong> {formData.city}</p>
            <p><strong>Postal Code:</strong> {formData.postalCode}</p>
            <p><strong>Address:</strong> {formData.address}</p>
          </div>
          <p className="text-gray-500 text-sm mt-3">
            The RFID Card will arrive in less than seven business days
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 w-full py-2 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-all"
          >
            View Order Details
          </button>
        </div>
      )}

      {confirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              Confirm Order
            </h2>
            <p>Are you sure you want to place this order?</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleConfirmYes}
                className="w-1/2 mr-2 py-2 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-all"
              >
                Yes
              </button>
              <button
                onClick={handleConfirmNo}
                className="w-1/2 ml-2 py-2 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition-all"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Order Confirmation
            </h2>
            <div className="space-y-2">
              <p><strong>Full Name:</strong> {formData.fullName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Province:</strong> {formData.province}</p>
              <p><strong>City:</strong> {formData.city}</p>
              <p><strong>Postal Code:</strong> {formData.postalCode}</p>
              <p><strong>Address:</strong> {formData.address}</p>
            </div>
            <button
              onClick={closeModal}
              className="mt-4 w-full py-2 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;