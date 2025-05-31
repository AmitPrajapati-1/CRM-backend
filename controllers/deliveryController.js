const CommunicationLog = require('../models/CommunicationLog');

exports.handleReceipt = async (req, res) => {
  const { logId, status } = req.body;
  await CommunicationLog.findByIdAndUpdate(logId, {
    status,
    sentAt: new Date()
  });
  
  res.json({ message: 'Delivery status updated' });
};