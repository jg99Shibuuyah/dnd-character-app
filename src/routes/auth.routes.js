const express = require('express');
const controller = require('../controllers/auth.controller');
const { requireAuthApi } = require('../middleware/auth');

const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/me', controller.me);
router.put('/settings', requireAuthApi, controller.updateSettings);
router.post('/forgot', controller.forgot);
router.post('/reset', controller.reset);

module.exports = router;
