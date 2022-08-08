const express = require('express');
const { body } = require('express-validator/check');

const contactController = require('../controllers/contact');


const router = express.Router();

// GET /contact/users
router.get('/users', contactController.getAllUsers);

// GET /contact/user/userId

router.get('/users/:userId', contactController.getUser);

// POST /contanct/send
router.post('/send', contactController.sendMail);

module.exports = router;
