const express = require('express');
const { body } = require('express-validator/check');

const contactController = require('../controllers/contact');


const router = express.Router();

// SEND EMAIL From Client to Users
router.post('/send', contactController.sendMail);


module.exports = router;
