const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator/check");
const dotenv = require("dotenv");
const Post = require("../models/post");
const User = require("../models/user");
dotenv.config();
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const sendgrid = require("@sendgrid/mail");
const { query } = require("express");

// const transporter = nodemailer.createTransport(
//   sendgridTransport({
//     auth: {
//       api_key: process.env.SENDGRID_API_KEY,
//     },
//   })
// );

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

// Get all users
exports.getAllUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      if (!users) {
        const error = new Error("Could not find workers");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "Users fetched",
        users: users,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// Get single User
exports.getUser = (req, res, next) => {
  const userId = req.params.userId;

  User.findById(userId)
  .then(user => {
    if (!user) {
      const error = new Error("Could not find the worker.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Post fetched.",
      user:user,
    });
  })
  .catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

// Send emails from client
exports.sendMail = (req, res, next) => {
  const client_name = req.body.name;
  const client_lastName = req.body.lastName;
  const client_email = req.body.email;
  const client_subject = req.body.subject;
  const content = req.body.content;

  // transporter.sendMail({
  //   to: 'visar.abd@gmail.com',
  //   from: client_email,
  //   subject: client_subject,
  //   text: `Hello from ${client_name} ${client_lastName}
  //       The question is:
  //       ${content}`
  // })
  sendgrid
    .send({
      to: "visar.abd@gmail.com",
      from: client_email,
      subject: client_subject,
      text: `Hello from ${client_name} ${client_lastName}
        The question is: 
        ${content}`,
    })
    .then((result) => {
      res.status(200).json({ message: "Email was sent with @sendgrid." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
