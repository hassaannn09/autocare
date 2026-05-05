const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const mechanicOnly = require('../middleware/mechanicOnly');
const {
    bookAppointment,
    getMyAppointments,
    payAppointment,
    getAllAppointments,
    updateStatus,
    assignMechanic,
    getAssignedAppointments,
    updateJobStatus
} = require('../controllers/appointmentController');

router.post('/', auth, bookAppointment);
router.get('/my', auth, getMyAppointments);
router.put('/pay/:id', auth, payAppointment);
router.get('/all', auth, adminOnly, getAllAppointments);
router.put('/status/:id', auth, adminOnly, updateStatus);
router.put('/assign/:id', auth, adminOnly, assignMechanic);
router.get('/assigned', auth, mechanicOnly, getAssignedAppointments);
router.put('/job-status/:id', auth, mechanicOnly, updateJobStatus);

module.exports = router;