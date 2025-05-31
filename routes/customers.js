const express = require('express');
const router = express.Router();
const { customerSchema } = require('../validation'); // Joi validation schema
const redisClient = require('../config/redis');
const Customer = require('../models/Customer'); 
// Helper: Add to Redis Stream
async function publishToStream(action, data = {}, criteria = {}) {
  await redisClient.xAdd('customers_stream', '*', {
    action,
    data: JSON.stringify(data),
    criteria: JSON.stringify(criteria),
  });
}
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});
// 📌 Create Customer
router.post('/', async (req, res) => {
  const { error } = customerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    await publishToStream('create', req.body);
    res.status(202).json({ message: 'Customer creation queued.' });
  } catch (err) {
    res.status(500).json({ error: 'Redis error', details: err.message });
  }
});


module.exports = router;
