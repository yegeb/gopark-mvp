const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    plateNumber: {
        type: String,
        required: true,
        uppercase: true
    },
    carBrand: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
