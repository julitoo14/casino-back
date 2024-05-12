const express = require('express');
const router = express.Router();
const partidaController = require('../controllers/partidaController');

router.post('/play/:userId', partidaController.startGame);
router.put('/hit/:id', partidaController.hit);
router.put('/stand/:id', partidaController.stand);


module.exports = router;