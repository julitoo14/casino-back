const express = require('express');
const router = express.Router();
const partidaController = require('../controllers/partidaController');
const check = require('../middlewares/auth');

router.post('/play/:userId', check.auth, partidaController.startGame);
router.put('/hit/:id', check.auth, partidaController.hit);
router.put('/stand/:id', check.auth, partidaController.stand);


module.exports = router;