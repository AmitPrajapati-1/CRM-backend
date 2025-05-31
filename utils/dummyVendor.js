const axios = require('axios');
const campaignModel = require('../models/Campaign');
async function sendMessage(logId, customer, message) {
  const isSuccess = Math.random() < 0.9;
  console.log(`Sending message to ${customer.name}: ${message} (Log ID: ${logId})`);
  await axios.post('https://crm-backend-production-a717.up.railway.app/api/delivery-receipt', {
    logId,
    status: isSuccess ? 'SENT' : 'FAILED',
  });

}

module.exports = { sendMessage };
