const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const auth = require('../middleware/auth');

// @route   POST api/reservations
// @desc    Create a reservation
// @access  Private
router.post('/', auth, reservationController.createReservation);

// @route   GET api/reservations
// @desc    Get user's reservations
// @access  Private
router.get('/', auth, reservationController.getMyReservations);

// @route   PUT api/reservations/:id/cancel
// @desc    Cancel reservation
// @access  Private
router.put('/:id/cancel', auth, reservationController.cancelReservation);

module.exports = router;
