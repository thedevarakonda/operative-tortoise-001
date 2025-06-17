import { Router } from 'express';
import db from '../db';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET!;

function getUserFromToken(req: any) {
  const auth = req.headers.authorization;
  if (!auth) throw new Error('No token');
  const token = auth.split(' ')[1];
  return jwt.verify(token, JWT_SECRET) as any;
}

// GET profile
router.get('/profile', (req, res) => {
  try {
    const user = getUserFromToken(req);
    const stmt = db.prepare('SELECT id, email, password_hash, created_at FROM users WHERE id = ?');
    const profile = stmt.get(user.id);
    res.json(profile);
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// UPDATE profile
router.put('/profile', (req, res) => {
  try {
    const user = getUserFromToken(req);
    const { name, email } = req.body;

    const stmt = db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?');
    stmt.run(name, email, user.id);

    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized or invalid data' });
  }
});

export default router;
