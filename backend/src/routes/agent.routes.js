const express = require('express');
const router = express.Router();
const { runAgent } = require('../controllers/agent.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/run', protect, runAgent);

module.exports = router;
