const Customer = require('../models/Customer');
const Campaign = require('../models/Campaign');
const CommunicationLog = require('../models/CommunicationLog');
const { parseRuleToMongoQuery } = require('../utils/ruleParser');
const { sendMessage } = require('../utils/dummyVendor');

exports.previewAudience = async (req, res) => {
  try {
    const query = parseRuleToMongoQuery(req.body.rules);
    const count = await Customer.countDocuments(query); 
    res.json({ audienceSize: count });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createCampaign = async (req, res) => {
  try {
    const { rules, message,objective } = req.body;;
    const query = parseRuleToMongoQuery(rules);
    const customers = await Customer.find(query);
    const campaign = await Campaign.create({ 
      name:objective,
      segmentRules: rules,
      audienceSize: customers.length,
      message: message,
     });
    for (const customer of customers) {
      // Personalize selected message
      const personalized = message;
      const log = await CommunicationLog.create({
        campaignId: campaign._id,
        customerId: customer._id,
        message: personalized,
      });

      await Customer.findByIdAndUpdate(customer._id, {
        $push: { messages: personalized },
      });

      await sendMessage(log._id, customer, personalized);

    }
    const statusCounts = await CommunicationLog.aggregate([
      { $match: { campaignId: campaign._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    let sentCount = 0;
    let failedCount = 0;
    statusCounts.forEach(stat => {
      if (stat._id === 'SENT') sentCount = stat.count;
      if (stat._id === 'FAILED') failedCount = stat.count;
    });
    await Campaign.findByIdAndUpdate(campaign._id, {
      $set: { sentCount, failedCount }
    });

    res.json({ message: 'Campaign created and messages sent' });
  } catch (error) {
    console.error("Error in createCampaign:", error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }

};


exports.getHistory = async (req, res) => {
  const logs = await CommunicationLog.aggregate([
    {
      $group: {
        _id: '$campaignId',
        sent: {
          $sum: { $cond: [{ $eq: ['$status', 'SENT'] }, 1, 0] }
        },
        failed: {
          $sum: { $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0] }
        },
        total: { $sum: 1 },
        latest: { $max: '$createdAt' }
      }
    },
    { $sort: { latest: -1 } }
  ]);

  res.json(logs);
};