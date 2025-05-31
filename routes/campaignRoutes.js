const express = require('express');
const router = express.Router();
const {
  previewAudience,
  createCampaign,
  getHistory
} = require('../controllers/campaignController');

router.post('/preview', previewAudience);
router.post('/create', createCampaign);
router.get('/history', getHistory);

module.exports = router;