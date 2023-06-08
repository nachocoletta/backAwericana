const nodemailer = require("nodemailer");
const { USER_EMAIL, PASSWORD_EMAIL } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: USER_EMAIL, // generated ethereal user
    pass: PASSWORD_EMAIL, // generated ethereal password
  },
});

transporter.verify().then(() => {
  console.log("ready for sending emails");
});

module.exports = transporter;
