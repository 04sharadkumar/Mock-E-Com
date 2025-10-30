// backend/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const DB_PATH = path.join(__dirname, 'ecom.db');
const db = new sqlite3.Database(DB_PATH);

function init() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY,
      productId INTEGER NOT NULL,
      qty INTEGER NOT NULL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS receipts (
      id INTEGER PRIMARY KEY,
      total REAL NOT NULL,
      timestamp TEXT NOT NULL,
      payload TEXT
    )`);

    // seed products if empty
    db.get('SELECT COUNT(*) as cnt FROM products', (err, row) => {
      if (err) return console.error(err);
      if (row.cnt === 0) {
        const items = [
          ['Classic Tee', 499.00],
          ['Sneakers', 2499.00],
          ['Sunglasses', 799.00],
          ['Backpack', 1399.00],
          ['Wireless Earbuds', 2999.00],
          ['Coffee Mug', 249.00]
        ];
        const stmt = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)');
        items.forEach(i => stmt.run(i[0], i[1]));
        stmt.finalize();
        console.log('Seeded products');
      }
    });
  });
}

function allProducts(cb) {
  db.all('SELECT id, name, price FROM products', cb);
}

function getCart(cb) {
  const q = `
    SELECT cart.id as cartId, cart.qty, products.id as productId, products.name, products.price
    FROM cart JOIN products ON cart.productId = products.id
  `;
  db.all(q, (err, rows) => {
    if (err) return cb(err);
    const total = rows.reduce((s, r) => s + r.qty * r.price, 0);
    cb(null, { items: rows, total });
  });
}

function addToCart(productId, qty, cb) {
  db.get('SELECT id, qty FROM cart WHERE productId = ?', [productId], (err, row) => {
    if (err) return cb(err);
    if (row) {
      const newQty = row.qty + qty;
      db.run('UPDATE cart SET qty = ? WHERE id = ?', [newQty, row.id], function(err2) {
        cb(err2, { id: row.id, productId, qty: newQty });
      });
    } else {
      db.run('INSERT INTO cart (productId, qty) VALUES (?, ?)', [productId, qty], function(err3) {
        cb(err3, { id: this.lastID, productId, qty });
      });
    }
  });
}

function removeFromCart(cartId, cb) {
  db.run('DELETE FROM cart WHERE id = ?', [cartId], function(err) {
    cb(err, { deleted: this.changes });
  });
}

function createReceipt(cartItems, total, cb) {
  const ts = new Date().toISOString();
  const payload = JSON.stringify(cartItems);
  db.run('INSERT INTO receipts (total, timestamp, payload) VALUES (?, ?, ?)', [total, ts, payload], function(err) {
    if (err) return cb(err);
    db.run('DELETE FROM cart', (e) => {
      cb(e, { id: this.lastID, total, timestamp: ts, items: cartItems });
    });
  });
}

module.exports = { init, allProducts, getCart, addToCart, removeFromCart, createReceipt };
