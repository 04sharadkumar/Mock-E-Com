// frontend/src/api.js
const API = import.meta.env.VITE_API_URL || 'https://mock-e-com-f77v.onrender.com';

export async function fetchProducts() {
  const r = await fetch(`${API}/api/products`);
  if (!r.ok) throw new Error("Fetch products failed");

  const data = await r.json();
  console.log("Fetched products:", data);
  return data;
}

export async function fetchCart() {
  const r = await fetch(`${API}/api/cart`);
  if (!r.ok) throw new Error("Fetch cart failed");

  const data = await r.json();
  console.log("Fetched cart:", data);

  return data;
}

export async function addToCart(productId, qty = 1) {
  const r = await fetch(`${API}/api/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, qty })
  });
  console.log(r.data);
  if (!r.ok) throw new Error('Add to cart failed');
  return r.json();
}

export async function deleteCartItem(cartId) {
  const r = await fetch(`${API}/api/cart/${cartId}`, { method: 'DELETE' });
  if (!r.ok) throw new Error('Delete failed');
  return r.json();
}

export async function checkout(cartItems, name, email) {
  const r = await fetch(`${API}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartItems, name, email })
  });
  if (!r.ok) {
    const err = await r.json().catch(()=>({error:'checkout error'}));
    throw new Error(err.error || 'Checkout failed');
  }
  return r.json();
}
