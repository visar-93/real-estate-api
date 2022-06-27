const express = require("express");
const { body } = require("express-validator/check");

const User = require("../models/user");
const authController = require('../controllers/auth');
const router = express.Router();

router.put("/signup", [
  body("email")
  .isEmail()
  .withMessage("Please enter a valid email.")
  .custom((value, {req}) => {
      return User.findOne({email: value})
      .then(userDoc => {
          if(userDoc) {
              return Promise.reject('E-mail address already exists');
          }
      });
  })
  .normalizeEmail(), // this method will remove dots "." from email, sometimes it can cause trou
  body('password').trim().isLength({min: 5}),
  body('username').trim().not().isEmpty()  
],
authController.signup);

router.post('/login', authController.login);

router.put('/logout', authController.logout);

module.exports = router;
