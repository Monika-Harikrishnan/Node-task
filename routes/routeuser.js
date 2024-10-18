const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController.js'); 

// Routes
router.post('/login', userController.login);
router.post('/logout', verifyToken, userController.logout);
router.post('/users', verifyToken, userController.createUser);
router.get('/users', verifyToken, userController.retrieveUser);
router.get('/users/:id', verifyToken, userController.retrieveUserId);
router.put('/users/:id', verifyToken, userController.updateUser);
router.delete('/users/:id', verifyToken, userController.deleteuser);

module.exports = router;
