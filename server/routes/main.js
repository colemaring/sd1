const express = require('express');
const driverRoutes = require('./driverRoutes');
const riskEventRoutes = require('./riskEventRoutes');
const tripRoutes = require('./tripRoutes');

const router = express.Router(); 

router.use('/v1/driver', driverRoutes); // For drivers
router.use('/v1/risks', riskEventRoutes); // For risk events
router.use('/v1/trips', tripRoutes); // For trips

module.exports = router; 
