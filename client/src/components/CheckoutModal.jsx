import React, { useState } from "react";
import { checkout } from "../utils/api";

export default function CheckoutModal({
  open,
  onClose,
  items,
  total,
  onChecked,
  receipt,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!name || !email) return alert("Please fill out all fields!");
    setLoading(true);
    try {
      const res = await checkout(items, name, email);
      console.log("Checkout Response:", res);

      // 👇 send only actual receipt object
      onChecked(res.receipt);
    } catch (err) {
      alert("Checkout failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center">
          {receipt ? "Order Successful 🎉" : "Checkout"}
        </h2>

        {receipt ? (
          <div className="space-y-4 text-center">
            <p className="text-green-600 font-semibold text-lg">
              ✅ Payment Successful!
            </p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-800 font-medium">
                Total Paid: ₹{receipt.total}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(receipt.timestamp).toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              disabled={loading}
              onClick={handleCheckout}
              className={`w-full py-2.5 rounded-lg text-white font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Processing..." : `Pay ₹${total}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
