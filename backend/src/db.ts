// backend/src/db.ts
import Database from 'better-sqlite3';

const db = new Database('ecommerce.db');

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create categories table
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );
`);

// Create products table
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL CHECK(price >= 0),
    image_url TEXT,
    stock_quantity INTEGER DEFAULT 0 CHECK(stock_quantity >= 0),
    category_id INTEGER,
    brand TEXT,
    rating REAL CHECK(rating >= 0 AND rating <= 5),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );
`);

// Seed categories if empty
const categoryCountResult = db.prepare('SELECT COUNT(*) AS count FROM categories').get() as { count: number };
const categoryCount = categoryCountResult.count;

if (categoryCount === 0) {
  const insertCategory = db.prepare('INSERT INTO categories (name) VALUES (?)');
  const categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Toys', 'Furniture'];
  const insertMany = db.transaction(() => {
    categories.forEach(name => insertCategory.run(name));
  });
  insertMany();
  console.log('✅ Seeded categories');
}

// Seed products if empty
const productCountResult = db.prepare('SELECT COUNT(*) AS count FROM products').get() as { count: number };
const productCount = productCountResult.count;

if (productCount === 0) {
  const insertProduct = db.prepare(`
    INSERT INTO products (title, description, price, image_url, stock_quantity, category_id, brand, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const products = [
    {
      title: 'Sony WH-1000XM4 Headphones',
      description: 'Industry leading noise canceling headphones.',
      price: 299.99,
      image_url: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg',
      stock_quantity: 50,
      category_id: 1,
      brand: 'Sony',
      rating: 4.7,
    },
    {
      title: 'Men’s Casual Sneakers',
      description: 'Comfortable everyday sneakers for men.',
      price: 49.99,
      image_url: 'https://m.media-amazon.com/images/I/71V4GGv1edL._SY695_.jpg',
      stock_quantity: 120,
      category_id: 2,
      brand: 'Puma',
      rating: 4.2,
    },
    {
      title: 'Modern Wooden Coffee Table',
      description: 'Perfect for your living room decor.',
      price: 89.99,
      image_url: 'https://m.media-amazon.com/images/I/A1myqiV2sqL._AC_UL320_.jpg',
      stock_quantity: 30,
      category_id: 6,
      brand: 'IKEA',
      rating: 4.4,
    },
    {
      title: 'Harry Potter Box Set',
      description: 'Complete 7-book collection.',
      price: 59.99,
      image_url: 'https://m.media-amazon.com/images/I/81iqZ2HHD-L._AC_UF1000,1000_QL80_.jpg',
      stock_quantity: 75,
      category_id: 4,
      brand: 'Bloomsbury',
      rating: 4.9,
    },
    {
      title: 'Stainless Steel Cookware Set',
      description: 'Durable, high-quality pots and pans.',
      price: 129.99,
      image_url: 'https://m.media-amazon.com/images/I/61+1sTRz+dL._AC_UL320_.jpg',
      stock_quantity: 40,
      category_id: 3,
      brand: 'Prestige',
      rating: 4.3,
    }
  ];

  const insertMany = db.transaction(() => {
    products.forEach(p =>
      insertProduct.run(
        p.title,
        p.description,
        p.price,
        p.image_url,
        p.stock_quantity,
        p.category_id,
        p.brand,
        p.rating
      )
    );
  });

  insertMany();
  console.log('✅ Seeded products');
}

export default db;
