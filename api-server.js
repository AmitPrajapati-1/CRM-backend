require('dotenv').config();
require('./utils/passport'); 
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const authRoutes = require('./routes/auth');
const redisClient = require('./config/redis');
const customerRoutes = require('./routes/customers');
const passport = require('passport');
const orderRoutes = require('./routes/order');
const bodyParser = require('body-parser');
const campaignRoutes = require('./routes/campaignRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const cors = require('cors');
const app = express();
const {getCampaignHistory}  = require('./controllers/campaign');
const generatedMessagesRouter = require('./generate-messages');
app.use(express.json());
app.use(cors()); 
app.use(bodyParser.json());
const fs = require('fs');
const path = require('path');
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    await redisClient.connect();
    console.log('✅ Connected to Redis');
   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use('/api/campaigns', campaignRoutes);
    app.use('/api/delivery-receipt', deliveryRoutes);
    app.use('/customers', customerRoutes);
    app.use('/orders', orderRoutes);
    app.use(passport.initialize());
    app.use('/api/auth', authRoutes);
    app.use('/api', require('./routes/dashboard'));
    app.use('/campaigns', getCampaignHistory);
    app.use('/', generatedMessagesRouter);
    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
}
startServer();
