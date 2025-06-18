import { Router } from 'express';
import db from '../db';

const router = Router();

// GET all products
// GET all products or filter by category
router.get('/', (req, res) => {
  const { category } = req.query;

  if (category) {
    const stmt = db.prepare(`
      SELECT p.*, c.name AS category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE LOWER(c.name) = LOWER(?)
    `);
    const products = stmt.all(category);
    res.json(products);
    console.log(products)
    return;
  }

  // If no category, return all products
  const stmt = db.prepare(`
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `);
  const products = stmt.all();
  res.json(products);
});

// GET product by ID
router.get('/:id', (req, res) => {
  const stmt = db.prepare(`
    SELECT p.*, c.name AS category_name 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `);
  const product = stmt.get(req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
} 
  res.json(product);
});

export default router;
