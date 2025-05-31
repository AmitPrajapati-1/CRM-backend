const express = require('express');
const router = express.Router();
const { orderSchema } = require('../validation');
const redisClient = require('../config/redis');
const Order = require('../models/Order');

// Helper: Add to Redis Stream
async function publishToStream(action, data = {}, criteria = {}) {
  await redisClient.xAdd('orders_stream', '*', {
    action,
    data: JSON.stringify(data),
    criteria: JSON.stringify(criteria),
  });
}

// 📌 Create Order
router.post('/', async (req, res) => {
  const { error } = orderSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    await publishToStream('create', req.body);
    res.status(202).json({ message: 'Order creation queued.' });
  } catch (err) {
    res.status(500).json({ error: 'Redis error', details: err.message });
  }
});

// 📌 GET: All Orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).populate('customerId', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});
module.exports = router;
