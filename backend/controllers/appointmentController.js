const Appointment = require('../models/Appointment');
const Service = require('../models/Service');

exports.bookAppointment = async (req, res) => {
    try {
        const { serviceId, date, timeSlot, vehicleInfo } = req.body;
        const service = await Service.findById(serviceId);
        if (!service) return res.status(404).json({ message: 'Service not found' });

        const appointment = await Appointment.create({
            customer: req.user.id,
            service: serviceId,
            date,
            timeSlot,
            vehicleInfo,
            totalAmount: service.price
        });

        res.status(201).json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ customer: req.user.id })
            .populate('service', 'name price duration')
            .populate('mechanic', 'name')
            .sort({ createdAt: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.payAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            _id: req.params.id,
            customer: req.user.id
        });
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        if (appointment.paymentStatus === 'paid') return res.status(400).json({ message: 'Already paid' });

        appointment.paymentStatus = 'paid';
        appointment.status = 'confirmed';
        await appointment.save();

        res.json({ message: 'Payment successful', appointment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('customer', 'name email')
            .populate('service', 'name price')
            .populate('mechanic', 'name')
            .sort({ createdAt: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin - assign mechanic
exports.assignMechanic = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { mechanic: req.body.mechanicId },
            { new: true }
        ).populate('mechanic', 'name');
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mechanic - get assigned appointments
exports.getAssignedAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ mechanic: req.user.id })
            .populate('customer', 'name')
            .populate('service', 'name duration')
            .sort({ date: 1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mechanic - update job status
exports.updateJobStatus = async (req, res) => {
    try {
        const allowed = ['pending', 'in-progress', 'done'];
        if (!allowed.includes(req.body.status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const appointment = await Appointment.findOneAndUpdate(
            { _id: req.params.id, mechanic: req.user.id },
            { status: req.body.status },
            { new: true }
        );
        if (!appointment) return res.status(404).json({ message: 'Not found or not assigned to you' });
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};