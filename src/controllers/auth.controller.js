const jwt = require("jsonwebtoken");
const authModels = require("../models/auth.model");
const bcrypt = require("bcrypt");
const env = require("../configs/environment");

const MAIL_SETTINGS = {
  host: env.host_link,
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: env.email,
    pass: env.passwordEmail,
  },
};
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

const regist = async (req, res) => {
  try {
    const { body } = req;
    const pass = body.password;
    const linkDirect = body.link_direct;
    const hashedPassword = await bcrypt.hash(pass, 10);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      res.status(404).json({
        msg: "Email Invalid",
      });
    }
    const emailFromDb = await authModels.getEmail(body);
    if (emailFromDb.rows.length === 1) {
      res.status(400).json({
        msg: "Email already exists",
      });
      return;
    }
    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    const verifyUrl = `${linkDirect}/${body.email}`;
    const mailoptions = {
      from: "redhadefinto28@gmail.com",
      to: `${body.email}`,
      subject: "Verification Your Email 👻",
      html: `
    <div
      class="container"
      style="max-width: 90%; margin: auto; padding-top: 20px">
      <h2>Hi.</h2>
      <h4>This Is Your Link Verification</h4>
      <p>${OTP}</p>
      <p style="margin-bottom: 30px">
        Please click
        <a href="${verifyUrl}" style="color: red" target="_blank">here</a> to
        verif your email
      </p>
    </div>
      `,
    };
    transporter.sendMail(mailoptions, async function (error, info) {
      if (error) {
        console.log(error);
        return res.status(400).json({
          msg: "Email / password invalid",
        });
      } else {
        console.log(`Email send: ${info.response}`);
        const result = await authModels.register(body, hashedPassword, OTP);
        return res.status(200).json({
          data: result.rows,
          msg: "Please Verify your account",
        });
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const verify = async (req, res) => {
  try {
    const { otp } = req.body;
    const { email } = req.params;
    const getOtpDB = await authModels.getOtp(email);
    if (getOtpDB.rows[0].otp !== otp) {
      return res.status(404).json({
        msg: "OTP Not valid",
      });
    }
    const result = await authModels.verify(email);
    res.status(200).json({
      data: result.rows,
      msg: "Verify Succes",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  regist,
  verify,
};
