const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  amount: Number,
  Product: String,
  quantity: Number,
  date: Date
});
module.exports = mongoose.model('Order', OrderSchema);
