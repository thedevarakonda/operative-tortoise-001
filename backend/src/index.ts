import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import productsRoutes from './routes/products';       // ✅ new
import categoriesRoutes from './routes/categories';   // ✅ new
import cartRoutes from './routes/carts';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
  res.send('Backend is up and running!');
});

app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api/products', productsRoutes);       // ✅ mount it
app.use('/api/categories', categoriesRoutes);   // ✅ mount it
app.use('/api/cart',cartRoutes)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
