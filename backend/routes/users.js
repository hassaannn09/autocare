const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { getPendingUsers, updateUserStatus, getMechanics } = require('../controllers/userController');

router.get('/pending', auth, adminOnly, getPendingUsers);
router.put('/:id/status', auth, adminOnly, updateUserStatus);
router.get('/mechanics', auth, adminOnly, getMechanics);

module.exports = router;