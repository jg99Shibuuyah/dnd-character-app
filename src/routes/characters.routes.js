const express = require('express');
const controller = require('../controllers/characters.controller');

const router = express.Router();

router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.post('/:id/duplicate', controller.duplicate);
router.delete('/:id', controller.remove);

module.exports = router;
