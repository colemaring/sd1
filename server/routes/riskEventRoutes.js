const express = require('express');
const riskEventController = require('../controllers/riskEventController');
const router = express.Router();

router.post("/", riskEventController.createRiskEvent);  // POST /api/v1/risks
router.get("/", riskEventController.getAllRiskEvents);  // GET /api/v1/risks

module.exports = router;
