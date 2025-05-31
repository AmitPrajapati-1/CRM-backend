const mongoose = require('mongoose');
const CommunicationLogSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  status: { type: String, enum: ['SENT', 'FAILED', 'PENDING'], default: 'PENDING' },
  message: String,
  sentAt: Date
});
module.exports = mongoose.model('CommunicationLog', CommunicationLogSchema);
