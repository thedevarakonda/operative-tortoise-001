// backend/src/routes/orders.ts
import express from 'express';
import db from '../db';

const router = express.Router();

// TypeScript interfaces
interface CartItem {
  product_id: number;
  quantity: number;
  price: number;
  title: string;
  stock_quantity: number;
}

interface OrderItem {
  quantity: number;
  unit_price: number;
  product_title: string;
  image_url: string | null;
  brand: string | null;
  product_id: number;
}

interface Order {
  order_id: number;
  user_id: number;
  total_amount: number;
  order_status: string;
  created_at: string;
  updated_at: string;
}

// Create new order from cart
router.post('/', (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    res.status(400).json({ error: 'User ID is required' });
    return 
  }

  try {
    // Get cart items with product details
    const cartItems = db.prepare(`
      SELECT ci.product_id, ci.quantity, p.price, p.title, p.stock_quantity
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `).all(user_id) as CartItem[];

    if (cartItems.length === 0) {
      res.status(400).json({ error: 'Cart is empty' });
      return 
    }

    // Check stock availability
    for (const item of cartItems) {
      if (item.quantity > item.stock_quantity) {
        res.status(400).json({ 
          error: `Insufficient stock for ${item.title}. Available: ${item.stock_quantity}, Requested: ${item.quantity}` 
        });
        return 
      }
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Start transaction
    const transaction = db.transaction(() => {
      // Create order
      const insertOrder = db.prepare(`
        INSERT INTO orders (user_id, total_amount, order_status)
        VALUES (?, ?, 'pending')
      `);
      const orderResult = insertOrder.run(user_id, total);
      const orderId = orderResult.lastInsertRowid;

      // Insert order items and update stock
      const insertOrderItem = db.prepare(`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, product_title)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      const updateStock = db.prepare(`
        UPDATE products 
        SET stock_quantity = stock_quantity - ?
        WHERE id = ?
      `);

      cartItems.forEach(item => {
        insertOrderItem.run(orderId, item.product_id, item.quantity, item.price, item.title);
        updateStock.run(item.quantity, item.product_id);
      });

      // Clear cart
      const clearCart = db.prepare('DELETE FROM cart_items WHERE user_id = ?');
      clearCart.run(user_id);

      return orderId;
    });

    const orderId = transaction();
    
    res.json({ 
      order_id: orderId, 
      total_amount: total,
      message: 'Order created successfully' 
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user's orders
router.get('/user/:user_id', (req, res) => {
  const { user_id } = req.params;

  try {
    const orders = db.prepare(`
      SELECT order_id, total_amount, order_status, created_at
      FROM orders 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).all(user_id) as Order[];

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order details with items
router.get('/:order_id', (req, res) => {
  const { order_id } = req.params;

  try {
    // Get order details
    const order = db.prepare(`
      SELECT * FROM orders WHERE order_id = ?
    `).get(order_id) as Order | undefined;

    if (!order) {
     res.status(404).json({ error: 'Order not found' });
     return    
    }

    // Get order items with product details
    const items = db.prepare(`
      SELECT 
        oi.quantity, 
        oi.unit_price, 
        oi.product_title,
        p.image_url, 
        p.brand,
        p.id as product_id
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(order_id) as OrderItem[];

    res.json({ order, items });
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

// Update order status
router.patch('/:order_id/status', (req, res) => {
  const { order_id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid order status' });
    return 
  }

  try {
    const updateOrder = db.prepare(`
      UPDATE orders 
      SET order_status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE order_id = ?
    `);
    
    const result = updateOrder.run(status, order_id);

    if (result.changes === 0) {
      res.status(404).json({ error: 'Order not found' });
      return 
    }

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;