require('dotenv').config();
const mongoose = require('mongoose');
const redisClient = require('./config/redis');
const Customer = require('./models/Customer');
const Order = require('./models/Order');

async function processStream(stream, Model, type) {
  let lastId = '0-0';
  while (true) {
    try {
      const response = await redisClient.xRead(
        [{ key: stream, id: lastId }],
        { BLOCK: 5000, COUNT: 10 }
      );
      if (response) {
        for (const message of response[0].messages) {
          const data = JSON.parse(message.message.data);
          try {
            await Model.create(data);
            console.log(`[DB] ${type} saved:`, data);
          } catch (err) {
            console.error(`[DB] Error saving ${type}:`, err.message);
          }
          lastId = message.id;
        }
      }
    } catch (err) {
      console.error(`❌ Stream processing error (${type}):`, err.message);
    }
  }
}

async function initConsumer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Consumer connected to MongoDB');

    await redisClient.connect();
    console.log('✅ Consumer connected to Redis');

    processStream('customers_stream', Customer, 'Customer');
    processStream('orders_stream', Order, 'Order');
  } catch (err) {
    console.error('❌ Consumer startup error:', err);
    process.exit(1);
  }
}

initConsumer();
