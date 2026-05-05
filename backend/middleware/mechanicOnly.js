module.exports = (req, res, next) => {
    if (req.user.role !== 'mechanic' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Mechanic access only' });
    }
    next();
};