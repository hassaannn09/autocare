const User = require('../models/User');

// Admin - get all pending users
exports.getPendingUsers = async (req, res) => {
    try {
        const users = await User.find({ status: 'pending' }).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin - approve or reject user
exports.updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin - get all mechanics
exports.getMechanics = async (req, res) => {
    try {
        const mechanics = await User.find({ role: 'mechanic', status: 'approved' })
            .select('name email');
        res.json(mechanics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};