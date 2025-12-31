const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');

// @route   GET api/parking
// @desc    Get all parking lots (with filters)
// @access  Public
router.get('/', parkingController.getAllParkings);

// @route   PATCH api/parking/:id/occupancy
// @desc    Update occupancy
// @access  Public (should be protected in real app, keeping simple for MVP)
router.patch('/:id/occupancy', parkingController.updateOccupancy);

module.exports = router;
