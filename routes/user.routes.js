//importar dependencias
const express = require('express');
//cargar router
const router = express.Router();
// importar controlador
const userController = require('../controllers/userController');

//definir ruta
router.post('/register', userController.register)
router.post('/login' , userController.login)
router.get('/user/:id', userController.getUser)

//exportar ruta
module.exports = router;