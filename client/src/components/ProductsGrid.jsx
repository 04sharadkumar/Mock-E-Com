import React from "react";

export default function ProductsGrid({ products = [], onAdd }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <div
          key={p.id}
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col"
        >
          <img
            src={`https://picsum.photos/300?random=${p.id}`}
            alt={p.name}
            className="rounded-lg mb-3 w-full h-48 object-cover"
          />

          <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
          <p className="text-gray-600 mb-4">₹{Number(p.price).toFixed(2)}</p>

          <button
            onClick={() => onAdd(p.id)}
            className="mt-auto bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
