const express = require('express');
const router = express.Router();
const { handleReceipt } = require('../controllers/deliveryController');

router.post('/', handleReceipt);

module.exports = router;
