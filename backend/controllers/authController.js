const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, inviteCode } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already registered' });

        // Invite code check for admin
        if (role === 'admin') {
            if (!inviteCode || inviteCode !== process.env.ADMIN_INVITE_CODE) {
                return res.status(403).json({ message: 'Invalid invite code for admin registration' });
            }
        }

        const hashed = await bcrypt.hash(password, 10);

        // Customers auto-approved, admins and mechanics need approval
        const status = role === 'customer' ? 'approved' : 'pending';

        const user = await User.create({ name, email, password: hashed, role, status });

        if (status === 'pending') {
            return res.status(201).json({
                message: 'Registration successful. Your account is pending admin approval.'
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Invalid email or password' });

        if (user.status === 'pending') {
            return res.status(403).json({ message: 'Your account is pending admin approval' });
        }

        if (user.status === 'rejected') {
            return res.status(403).json({ message: 'Your account has been rejected. Contact support.' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};