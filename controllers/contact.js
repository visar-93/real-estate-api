const { validationResult } = require("express-validator/check");
const dotenv = require("dotenv");
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

// Send email from clients
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
  