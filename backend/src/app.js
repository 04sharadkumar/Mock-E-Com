require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./config/db");

const app = express();

// -------------------------------
// 🧩 Allowed Origins (Frontend URLs)
// -------------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "https://mocke-comcart.netlify.app/",
  "https://mock-e-com-eight.vercel.app/",
  "https://mock-e-com-git-main-04sharadkumars-projects.vercel.app/",
  "https://mock-e-2mnfdbq5x-04sharadkumars-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman or server-to-server requests
      if (!allowedOrigins.includes(origin)) {
        return callback(
          new Error("CORS policy does not allow access from this origin"),
          false
        );
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Middlewares

app.use(bodyParser.json());
app.use(morgan("dev"));

// Initialize DB
db.init();

// Routes

// GET /api/products
app.get("/api/products", (req, res) => {
  db.allProducts((err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(rows);
  });
});
// GET /api/cart
app.get("/api/cart", (req, res) => {
  db.getCart((err, data) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(data);
  });
});

// POST /api/cart { productId, qty }
app.post("/api/cart", (req, res) => {
  const { productId, qty } = req.body;
  if (!productId || !qty || qty < 1)
    return res.status(400).json({ error: "Invalid payload" });
  db.addToCart(productId, qty, (err) => {
    if (err) return res.status(500).json({ error: "DB error" });
    db.getCart((e, result) => {
      if (e) return res.status(500).json({ error: "DB error" });
      res.json(result);
    });
  });
});

// DELETE /api/cart/:id
app.delete("/api/cart/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: "Invalid id" });
  db.removeFromCart(id, (err) => {
    if (err) return res.status(500).json({ error: "DB error" });
    db.getCart((e, result) => {
      if (e) return res.status(500).json({ error: "DB error" });
      res.json(result);
    });
  });
});

// POST /api/checkout { cartItems, name, email }
app.post("/api/checkout", (req, res) => {
  const { cartItems = [], name, email } = req.body;
  if (!name || !email || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: "Missing checkout data" });
  }

  // calculate server-side
  db.getCart((err, { items, total }) => {
    if (err) return res.status(500).json({ error: "DB error" });
    const receiptItems = items.map((i) => ({
      productId: i.productId,
      name: i.name,
      qty: i.qty,
      price: i.price,
    }));
    db.createReceipt(receiptItems, total, (e, receipt) => {
      if (e) return res.status(500).json({ error: "DB error" });
      res.json({ receipt: { ...receipt, name, email } });
    });
  });
});

// ✅ Health Check
app.get("/api/health", (req, res) => res.json({ ok: true }));

module.exports = app;
