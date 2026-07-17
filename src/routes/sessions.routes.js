const express = require('express');
const controller = require('../controllers/sessions.controller');

const router = express.Router();

router.get('/', controller.list);
router.post('/', controller.create);
router.post('/join', controller.join);
router.post('/preview', controller.preview);
router.get('/:id', controller.detail);
router.put('/:id/character', controller.setCharacter);
router.post('/:id/host-characters', controller.addHostCharacter);
router.delete('/:id/host-characters/:characterId', controller.removeHostCharacter);
router.post('/:id/leave', controller.leave);
router.delete('/:id', controller.remove);

module.exports = router;
