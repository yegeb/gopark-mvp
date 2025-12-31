const mongoose = require('mongoose');

const ParkingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    neighborhood: {
        type: String,
        required: true
    },
    totalCapacity: {
        type: Number,
        required: true
    },
    currentOccupancy: {
        type: Number,
        default: 0
    },
    pricePerHour: {
        type: Number,
        required: true
    },
    coordinates: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Parking', ParkingSchema);
