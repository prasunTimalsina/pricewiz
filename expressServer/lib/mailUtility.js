import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.MAIL_PASS,
  },
});

function sendMail(to, subject, text) {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    html: text,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

sendMail("uniquep42@gmail.com", "Hello", "This is a test email");
