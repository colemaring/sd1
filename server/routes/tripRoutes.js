const express = require('express');
const tripController = require('../controllers/tripController'); 
const router = express.Router();


router.get('/', tripController.getAllTrips); // GET /api/v1/trips

module.exports = router; 
