const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parkingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parking',
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Cancelled'],
        default: 'Active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', ReservationSchema);
