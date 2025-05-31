const { array } = require('joi');
const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  totalSpend: Number,
  visits: Number,
  lastActive: Date,
  messages:[String],
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Customer', customerSchema);
