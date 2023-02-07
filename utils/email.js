const nodemailer = require('nodemailer');

const sendEmail = async options => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'skylineemailer@gmail.com',
      pass: 'xtwtggxdfqhzucqq',
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 5 * 60 * 1000,
  });

  const mailOptions = {
    from: 'skylineemailer@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;