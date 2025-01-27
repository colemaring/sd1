const express = require('express');
const driverController = require('../controllers/driverController');
const router = express.Router();

router.post("/", driverController.createDriver);  // POST /api/v1/driver
router.get("/", driverController.getAllDrivers);  // GET /api/v1/driver
router.put("/:id", driverController.updateDriverActiveStatus);  // PUT /api/v1/driver/:id

module.exports = router;
