const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendGrid = (email, verificationToken) => {
  const msg = {
    to: email,
    from: "antonvdo@meta.ua",
    subject: "Thank you for registration",
    text: "and easy to do anywhere, even with Node.js",
    html: `<a href="http://localhost:3000/users/verify/${verificationToken}">Link verification</a>`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = sendGrid;
