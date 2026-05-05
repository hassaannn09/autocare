const Service = require('../models/Service');

// Admin - Create service
exports.createService = async (req, res) => {
    try {
        const service = await Service.create(req.body);
        res.status(201).json(service);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin - Update service
exports.updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!service) return res.status(404).json({ message: 'Service not found' });
        res.json(service);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin - Delete service
exports.deleteService = async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Public - Get all services
exports.getServices = async (req, res) => {
    try {
        const services = await Service.find({ available: true });
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};