import { useEffect, useState } from "react";
import { fetchProducts, fetchCart, addToCart } from "./utils/api";
import CartView from "./components/CartView";
import CheckoutModal from "./components/CheckoutModal";

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [prodData, cartData] = await Promise.all([
          fetchProducts(),
          fetchCart(),
        ]);
        setProducts(prodData);
        setCart(cartData);
      } catch (err) {
        console.error("Loading error:", err);
      }
    })();
  }, []);

  const handleAddToCart = async (id) => {
    try {
      await addToCart(id);
      const updated = await fetchCart();
      setCart(updated);
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
    if (receipt) setCart({ items: [], total: 0 }); // ✅ empty cart on success
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 🧭 Header */}
      <header className="bg-blue-600 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
            Mock E-Com
          </h1>
          <button
            onClick={() => setShowCheckout(true)}
            className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-md shadow-sm hover:bg-gray-100 transition"
          >
            Cart ({cart.items?.length || 0})
          </button>
        </div>
      </header>

      {/* 🛍️ Product Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Featured Products
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-500 text-center">Loading products...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow hover:shadow-lg p-4 flex flex-col border border-gray-100 transition"
              >
                <div className="relative mb-3">
                  <img
                    src={`https://picsum.photos/seed/${p.id}/400/300`}
                    alt={p.name}
                    className="rounded-lg w-full h-48 object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">
                  {p.name}
                </h3>
                <p className="text-gray-600 mb-4 font-semibold">
                  ₹{p.price.toFixed(2)}
                </p>
                <button
                  onClick={() => handleAddToCart(p.id)}
                  className="mt-auto bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 💳 Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          open={showCheckout}
          onClose={handleCloseCheckout}
          items={cart.items}
          total={cart.total}
          onChecked={(r) => setReceipt(r)}
          receipt={receipt}
        />
      )}
    </div>
  );
}
