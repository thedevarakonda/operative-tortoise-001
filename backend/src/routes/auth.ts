// backend/src/routes/auth.ts
import { Router } from 'express';
import db from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET!;

type User = {
  id: number;
  email: string;
  password_hash: string;
};

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const password_hash = await bcrypt.hash(password, 10);
  console.log("Here");

  try {
    const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
    stmt.run(email, password_hash);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err: any) {
    res.status(400).json({ error: 'Email already in use' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email) as User | undefined;

  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const payload = { id: user.id, email: user.email };
  const token = jwt.sign(payload, JWT_SECRET as string, { expiresIn: '1h' });

  res.json({ token });
});


router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) {
    res.status(401).json({ error: 'Missing token' });
    return;
  }

  try {
    const token = auth.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Invalid token format' });
      return;
    }
    
    const decoded = jwt.verify(token, JWT_SECRET as string) as { id: number; email: string };
    res.json({ user: decoded });
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

export default router;
