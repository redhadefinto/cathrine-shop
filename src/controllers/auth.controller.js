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

const login = async (req, res) => {
  try {
    const { body } = req;
    const result = await authModels.userVerification(body);
    if (result.rows.length < 1)
      return res.status(401).json({
        msg: "Account not found",
      });
    const { id, role_id, password, phone, image } = result.rows[0];
    const isPasswordValid = await bcrypt.compare(body.password, password);
    if (!isPasswordValid)
      return res.status(401).json({
        msg: "Email/Password Salah",
      });
    const payload = {
      id,
      role_id,
      image,
      phone,
    };
    const jwtOptions = {
      expiresIn: "7 days",
    };
    jwt.sign(payload, env.jwtSecret, jwtOptions, async (err, token) => {
      if (err) throw err;
      await authModels.createToken(token);
      res.status(200).json({
        msg: "Login Success",
        token,
        phone,
        image,
        role_id,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

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
      <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        ">
        <image
          src="https://grabngocourier.com/wp-content/uploads/2022/02/online-shopping-1-e1645816960640.png"
          style="width: 50px; height: 50px" />
        <h1>Klontong-Shop</h1>
      </div>
      <h2>Halo ${body.email}</h2>
      <p>
        Merry! Thank you for joining the online store "Klontong." To ensure the
        security of your account and provide a trusted shopping experience, we
        need to carry out a verification process.
      </p>

      <p>Your Otp :</p>
      <p style="color: black; font-weight: bold; font-size: 30px">${OTP}</p>

      <p>Please click on the link below to verify your account:</p>
      <button
        style="
          padding: 10px 15px;
          border-radius: 10px;
          background-color: rgb(202, 133, 5);
          cursor: pointer;
        ">
        <a href="${verifyUrl}" style="color: white; text-decoration: none"
          >here</a
        >
      </button>

      <p>
        If you can't access the link directly, please copy and paste it in your
        web browser address bar.
      </p>
      <p>
        Make sure to complete this verification process as quickly as possible
        in order You can enjoy shopping easily at the online shop "Klontong."
      </p>
      <p>
        If you never signed up for this account or thought you received this
        email mistakenly, please contact our support team immediately.
      </p>
      <p>
        Thank you for your trust in the online store "Klontong." We committed to
        providing the best service for all customers we.
      </p>
      <p>greetings shopping,</p>
      <p>- Team Klontong</p>
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
        const result = await authModels.regist(body, hashedPassword, OTP);
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

const createOtp = async (req, res) => {
  try {
    const { email, link_direct } = req.body;
    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    const result = await authModels.createOtp(email, OTP);
    console.log(result);
    if (result.rows < 1) {
      return res.status(404).json({
        msg: "Email Belum Terdaftar",
      });
    }
    const verifyUrl = `${link_direct}/${email}`;
    const mailoptions = {
      from: "tickitz.tim@gmail.com",
      to: `${email}`,
      subject: "Otp Code Verification 👻",
      html: `
            <div
      class="container"
      style="max-width: 90%; margin: auto; padding-top: 20px">
      <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
        ">
        <image
          src="https://grabngocourier.com/wp-content/uploads/2022/02/online-shopping-1-e1645816960640.png"
          style="width: 50px; height: 50px" />
        <h1>Klontong-Shop</h1>
      </div>
      <h2>Halo ${email}</h2>
      <p>
        Merry! Thank you for joining the online store "Klontong." To ensure the
        security of your account and provide a trusted shopping experience, we
        need to carry out a verification process.
      </p>

      <p>Your Otp :</p>
      <p style="color: black; font-weight: bold; font-size: 30px">${OTP}</p>

      <p>Please click on the link below to verify your account:</p>
      <button
        style="
          padding: 10px 15px;
          border-radius: 10px;
          background-color: rgb(202, 133, 5);
          cursor: pointer;
        ">
        <a href="${verifyUrl}" style="color: white; text-decoration: none"
          >here</a
        >
      </button>

      <p>
        If you can't access the link directly, please copy and paste it in your
        web browser address bar.
      </p>
      <p>
        Make sure to complete this verification process as quickly as possible
        in order You can enjoy shopping easily at the online shop "Klontong."
      </p>
      <p>
        If you never signed up for this account or thought you received this
        email mistakenly, please contact our support team immediately.
      </p>
      <p>
        Thank you for your trust in the online store "Klontong." We committed to
        providing the best service for all customers we.
      </p>
      <p>greetings shopping,</p>
      <p>- Team Klontong</p>
    </div>
      `,
    };
    transporter.sendMail(mailoptions, async function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({
          msg: "Internal Server Error",
        });
      } else {
        console.log(`Email send: ${info.response}`);
        // const result = await authModels.register(body, hashedPassword, OTP);
        await authModels.createOtp(email, OTP);
        return res.status(200).json({
          msg: "Please Check Your Email",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { otp } = req.params;
    const otpFromDb = await authModels.getOtpWithOtp(otp);
    // return console.log(otpFromDb);
    if (!otpFromDb.rows || otpFromDb.rows.length < 1) {
      return res.status(404).json({
        msg: "OTP Not valid",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(404).json({
        msg: "Passwords are not the same",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await authModels.forgot(otp, hashedPassword);
    res.status(200).json({
      msg: "Change password Success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const forgot = async (req, res) => {
  try {
    const { body } = req;
    const { email, link_direct } = req.body;
    const emailFromDb = await authModels.getEmail(body);
    if (emailFromDb.rows.length !== 1) {
      res.status(400).json({
        msg: "Email Not exists",
      });
      return;
    }
    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    const verifyUrl = `${link_direct}/${OTP}`;
    const mailoptions = {
      from: "tickitz.tim@gmail.com",
      to: `${email}`,
      subject: "Reset Password Verification 👻",
      html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Hi.</h2>
          <h4>This Is Your Link Verification</h4>
          <p style="margin-bottom: 30px;">Please click <a href="${verifyUrl}" style="color: red;">here</a> to verif your email</p>
    </div>
      `,
    };
    transporter.sendMail(mailoptions, async function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).json({
          msg: "Internal Server Error",
        });
      } else {
        console.log(`Email send: ${info.response}`);
        await authModels.createOtp(email, OTP);
        res.status(200).json({
          msg: "Please Check Your Email",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const logOut = async (req, res) => {
  try {
    const { authInfo } = req;
    await authModels.createBlackList(authInfo.token);
    res.status(200).json({
      msg: "Log Out Berhasil",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { authInfo } = req;
    const { body } = req;
    const oldPassword = await authModels.getOldPassword(authInfo.id);
    const isPasswordValid = await bcrypt.compare(
      body.oldPassword,
      oldPassword.rows[0].password
    );
    if (!isPasswordValid)
      return res.status(401).json({
        msg: "Password old Salah",
      });
    if (body.newPassword !== body.confirmPassword) {
      return res.status(401).json({
        msg: "passwords must be the same",
      });
    }
    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    await authModels.changePassword(hashedPassword, authInfo.id);
    res.status(200).json({
      msg: "Change Password Succes",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  login,
  regist,
  logOut,
  createOtp,
  forgot,
  verify,
  resetPassword,
  changePassword,
};
