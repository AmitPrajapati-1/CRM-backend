const express = require('express');
const Campaign = require('../models/Campaign');
async function getCampaignHistory(req, res) {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
}

module.exports = { getCampaignHistory };