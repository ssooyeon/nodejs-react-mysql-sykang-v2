const db = require("../models");
const User = db.users;
const Group = db.groups;
const nodemailer = require("nodemailer");

const ADMIN_GROUP_ID = 2;

const mailSender = {
  // administrator group의 사용자들에게 메일을 발송할 준비
  sendGmailToAdmin: (param) => {
    Group.findByPk(ADMIN_GROUP_ID, {
      include: [{ model: User, as: "users" }],
    }).then((group) => {
      const adminList = group.users.map((user) => user.email);
      const html =
        `<p><span style="font-size:30px;"><strong>${param.subject}</strong></span></p>` +
        `<br/>` +
        `<p><span>${param.title}</span></p>` +
        `<p>` +
        `<span>Please check the information below.</span></p>` +
        `<br/><hr align="left" style="width:50%;"/><br/>` +
        `${param.content}` +
        `<br/><hr align="left" style="width:50%;"/>` +
        `<p><br/></p>` +
        `<span>for more information, access the <a href="https://sopal.herokuapp.com/">https://sopal.herokuapp.com/</a> link, login as an administrator, click the "Users &amp; Groups" button on the left menu, and check the page.</span></p><br/><p><span>Thanks.</span>`;
      let data = {
        to: adminList,
        subject: param.subject,
        html: html,
      };
      mailSender.sendGmail(data);
    });
  },

  // 실제 메일을 발송
  sendGmail: (param) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      host: "smtp.gmail.com",
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAILER_ADDR,
        pass: process.env.MAILER_PASS,
      },
    });

    let mailOptions = {
      from: process.env.MAILER_ADDR,
      to: param.to,
      subject: param.subject,
      html: param.html,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Email sent: ${info.response}, to ${mailOptions.to}`);
      }
    });
  },
};

module.exports = mailSender;
