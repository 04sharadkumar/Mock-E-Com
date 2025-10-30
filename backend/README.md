# Backend (Express + SQLite)

cd backend
npm install
npm run dev    # or npm start

Database file: backend/src/config/ecom.db (auto-created). Products seeded on first run.
APIs:
GET  /api/products
GET  /api/cart
POST /api/cart      { productId, qty }
DELETE /api/cart/:id
POST /api/checkout  { cartItems, name, email }
