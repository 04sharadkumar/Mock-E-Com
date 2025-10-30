import React from "react";
import { deleteCartItem } from "../utils/api";

export default function CartView({ cart, refresh }) {
  const handleRemove = async (id) => {
    await deleteCartItem(id);
    refresh();
  };

  if (!cart.items.length) {
    return (
      <div className="text-center py-10 text-gray-600">
        <p className="text-lg font-medium">Your cart is empty 🛍️</p>
        <p className="text-sm text-gray-400 mt-1">Add some products to begin shopping!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cart.items.map((item) => (
        <div
          key={item._id}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
        >
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <img
              src={`https://picsum.photos/80?random=${item.product._id}`}
              alt={item.product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <p className="font-semibold text-gray-800">{item.product.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.qty}</p>
              <p className="text-sm text-gray-700 font-medium mt-1">
                ₹{item.product.price} × {item.qty}
              </p>
            </div>
          </div>

          <div className="flex justify-between sm:justify-end items-center gap-4 w-full sm:w-auto mt-3 sm:mt-0">
            <p className="font-semibold text-gray-800 text-lg">
              ₹{item.product.price * item.qty}
            </p>
            <button
              onClick={() => handleRemove(item._id)}
              className="bg-red-50 text-red-600 hover:bg-red-100 rounded-lg px-3 py-1.5 transition font-semibold"
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      <div className="text-right pt-4 border-t border-gray-200">
        <p className="font-bold text-xl text-blue-700">
          Total: ₹{cart.total}
        </p>
      </div>
    </div>
  );
}
