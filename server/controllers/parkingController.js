const Parking = require('../models/Parking');
const Reservation = require('../models/Reservation');

// Get all parking lots with optional filters and DYNAMIC occupancy
exports.getAllParkings = async (req, res) => {
    try {
        const { district, neighborhood } = req.query;
        let query = {};

        if (district) {
            query.district = district;
        }
        if (neighborhood) {
            query.neighborhood = neighborhood;
        }

        // 1. Get Parkings
        const parkings = await Parking.find(query).lean(); // Use lean() for better performance and easier modification

        // 2. Calculate Active Occupancy for each
        const now = new Date();

        const parkingsWithOccupancy = await Promise.all(parkings.map(async (parking) => {
            const activeReservationsCount = await Reservation.countDocuments({
                parkingId: parking._id,
                status: 'Active',
                startTime: { $lte: now },
                endTime: { $gte: now }
            });

            // Base Occupancy (from Seed/DB) + Active App Reservations
            let calculatedOccupancy = (parking.currentOccupancy || 0) + activeReservationsCount;

            // Cap at Total Capacity to avoid visual glitches if manually overriden
            if (calculatedOccupancy > parking.totalCapacity) {
                calculatedOccupancy = parking.totalCapacity;
            }

            return {
                ...parking,
                currentOccupancy: calculatedOccupancy
            };
        }));

        res.json(parkingsWithOccupancy);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update occupancy
exports.updateOccupancy = async (req, res) => {
    try {
        const { id } = req.params;
        const { change } = req.body; // +1 or -1

        let parking = await Parking.findById(id);
        if (!parking) {
            return res.status(404).json({ message: 'Parking not found' });
        }

        let newOccupancy = parking.currentOccupancy + change;

        // Validation
        if (newOccupancy < 0) newOccupancy = 0;
        if (newOccupancy > parking.totalCapacity) {
            return res.status(400).json({ message: 'Parking is full' });
        }

        parking.currentOccupancy = newOccupancy;
        await parking.save();

        res.json(parking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
