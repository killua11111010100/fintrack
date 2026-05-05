const express = require('express');
const router = express.Router();

const healthController = require('../controllers/health.controller');
const authRoutes = require('./auth.routes');

router.get('/health', healthController.getHealth);

router.use('/auth', authRoutes);

module.exports = router;