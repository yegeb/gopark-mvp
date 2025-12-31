const Reservation = require('../models/Reservation');
const Parking = require('../models/Parking');

exports.createReservation = async (req, res) => {
    try {
        const { parkingId, startTime, endTime } = req.body;
        const userId = req.user.id;

        if (!startTime || !endTime) {
            return res.status(400).json({ message: 'Start time and End time are required' });
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (start >= end) {
            return res.status(400).json({ message: 'Invalid time range' });
        }

        // 1. Check if User already has a reservation overlapping this time
        const userConflict = await Reservation.findOne({
            userId,
            status: 'Active',
            $or: [
                { startTime: { $lt: end }, endTime: { $gt: start } }
            ]
        });

        if (userConflict) {
            return res.status(400).json({ message: 'You already have a reservation during this time.' });
        }

        // 2. Check Parking Capacity for this slot
        const parking = await Parking.findById(parkingId);
        if (!parking) return res.status(404).json({ message: 'Parking not found' });

        // Count active reservations for this parking that overlap with the requested slot
        const activeReservationsCount = await Reservation.countDocuments({
            parkingId,
            status: 'Active',
            $or: [
                { startTime: { $lt: end }, endTime: { $gt: start } }
            ]
        });

        // Effective Occupancy = Base Occupancy (DB) + Active Overlapping Reservations
        // NOTE: This assumes base occupancy is constant. For a more advanced system, base occupancy would be time-based.
        // For this MVP, we treat DB occupancy as "static cars always there".
        const effectiveOccupancy = (parking.currentOccupancy || 0) + activeReservationsCount;

        if (effectiveOccupancy >= parking.totalCapacity) {
            return res.status(400).json({ message: 'Parking is full for the selected time slot.' });
        }

        // Create Reservation
        const reservation = new Reservation({
            userId,
            parkingId,
            startTime: start,
            endTime: end,
            status: 'Active'
        });

        await reservation.save();

        // Optional: Update currentOccupancy if the reservation starts NOW
        // For MVP simplicity, we might just leave currentOccupancy as a "current" snapshot, 
        // relying on this overlap check for future integrity.

        res.status(201).json({ message: 'Reservation created', reservation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMyReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ userId: req.user.id })
            .populate('parkingId', 'name district neighborhood pricePerHour coordinates')
            .sort({ startTime: -1 }); // Newest first
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.cancelReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Verify user owns this reservation
        if (reservation.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        if (reservation.status !== 'Active') {
            return res.status(400).json({ message: 'Reservation cannot be cancelled.' });
        }

        reservation.status = 'Cancelled';
        await reservation.save();

        res.json({ message: 'Reservation Cancelled' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
