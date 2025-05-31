const mongoose = require('mongoose');
const CampaignSchema = new mongoose.Schema({
  name: String,
  segmentRules: Object,
  audienceSize: Number,
  message: String,
  sentCount: {
    type: Number,
    default: 0
  },
  failedCount: {
    type: Number,
    default: 0
  },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Campaign', CampaignSchema);
