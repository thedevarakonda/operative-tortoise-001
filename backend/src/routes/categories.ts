import { Router } from 'express';
import db from '../db';

const router = Router();

// GET all categories
router.get('/', (req, res) => {
  const stmt = db.prepare('SELECT * FROM categories');
  const categories = stmt.all();
  res.json(categories);
});

export default router;
