const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true // e.g. "10:00 AM"
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid'
    },
    mechanic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    totalAmount: {
        type: Number,
        required: true
    },
    vehicleInfo: {
        make: String,
        model: String,
        year: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);