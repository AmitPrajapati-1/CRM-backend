const express = require('express');
const router = express.Router();
const CommunicationLog = require('../models/CommunicationLog');
const Customer = require('../models/Customer');
const Campaign = require('../models/Campaign');
// Get Campaign Communication Logs
router.get('/logs', async (req, res) => {
  try {
    const logs = await CommunicationLog.find()
      .populate('campaignId', 'name')
      .populate('customerId', 'name')
      .sort({ sentAt: -1 })
      .limit(20);

    console.log('Logs fetched:', logs);

    const formatted = logs.map(log => ({
      _id: log._id,
      campaignName: log.campaignId ? log.campaignId.name : "Unknown Campaign",
      customerName: log.customerId ? log.customerId.name : "Unknown Customer",
      status: log.status,
      message: log.message,
      sentAt: log.sentAt
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// Get Top Customers
router.get('/customers/top', async (req, res) => {
  try {
    const top = await Customer.find().sort({ totalSpend: -1 }).limit(10);
    res.json(top);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;