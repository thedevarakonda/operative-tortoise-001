import { Router } from 'express';
import jwt from 'jsonwebtoken';
import db from '../db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET!;

// Helper to extract user ID from token
function getUserIdFromToken(req: any): number | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    return decoded.id;
  } catch {
    return null;
  }
}

// GET cart items
router.get('/', (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId){
    res.status(401).json({ error: 'Unauthorized' });
    return 
  } 

  const stmt = db.prepare(`
    SELECT c.id, p.title, p.price, p.image_url, c.quantity
    FROM cart_items c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `);
  const items = stmt.all(userId);
  res.json(items);
});

// POST add to cart
router.post('/', (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId){
    res.status(401).json({ error: 'Unauthorized' });
    return; 
  } 

  const { product_id, quantity } = req.body;

  const existing = db.prepare(`
    SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?
  `).get(userId, product_id);

  if (existing) {
    db.prepare(`
      UPDATE cart_items SET quantity = quantity + ?
      WHERE user_id = ? AND product_id = ?
    `).run(quantity, userId, product_id);
  } else {
    db.prepare(`
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (?, ?, ?)
    `).run(userId, product_id, quantity);
  }

  res.json({ success: true });
});

// DELETE item from cart
router.delete('/:productId', (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId){
    res.status(401).json({ error: 'Unauthorized' });
    return;
  } 

  const { productId } = req.params;
  db.prepare(`
    DELETE FROM cart_items WHERE user_id = ? AND product_id = ?
  `).run(userId, Number(productId));

  res.json({ success: true });
});

export default router;
