const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const {
    createService,
    updateService,
    deleteService,
    getServices
} = require('../controllers/serviceController');

router.get('/', getServices); // public
router.post('/', auth, adminOnly, createService);
router.put('/:id', auth, adminOnly, updateService);
router.delete('/:id', auth, adminOnly, deleteService);

module.exports = router;