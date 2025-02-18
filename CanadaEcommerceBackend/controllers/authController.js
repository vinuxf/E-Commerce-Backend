const { hash } = require("bcrypt");
const bcrypt = require("bcrypt");
const authDbService = require("../services/authDbService");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const crypto = require("crypto");
const { decrypt } = require("dotenv");

const algorithm = "aes-256-cbc";
const secretKey = Buffer.from(process.env.SECRET_KEY, "hex");
const ivLength = 16;
const { sendRegistrationEmail }  = require("../controllers/emailController");


const register = async (req, res) => {
  try {
    const { FirstName, LastName, Email, Address, Password, Role } = req.body;

    const user_availability = await authDbService.checkUser(Email);
    if (user_availability.length === 0) {
      bcrypt.hash(Password, 10, async (err, hash) => {
        if (err) {
          return res.status(401).json({ Error: "Error hasing password ", err });
        }
        try {
          const new_user = await authDbService.register(
            FirstName,
            LastName,
            hash,
            Email,
            Address,
            Role
          );
           // Send email notification to the admin
           try {
            const adminEmail = process.env.ADMIN_EMAIL || "grocerysdirect03@gmail.com"; // Admin email address
            await sendRegistrationEmail({
              adminEmail,
              name: `${FirstName} ${LastName}`,
              email: Email,
            });
          } catch (emailErr) {
            console.error("Error sending registration email:", emailErr.message);
          }

          return res
            .status(201)
            .json({ message: "User registration completed!" });
        } catch (err) {
          res.status(401).json({
            message: "Somthing went wrong when inserting the user!",
            error: err,
          });
        }
      });
    } else {
      res
        .status(409)
        .json({ message: "The email is already registered in the system!" });
    }
  } catch (err) {
    res.status(409).json({
      message: "Somthing went wrong when registering the user!",
      error: err.message,
    });
  }
};

const checkToken = async (req, res) => {
  if (req.idUser) {
    res.status(200).json({
      Status: `Authentication Success. Token is valid. The user id is ${req.idUser}`,
    });
  } else {
    res
      .status(401)
      .json({ Status: "Authentication is not valid! Token is not valid!" });
  }
};

const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user_check = await authDbService.checkUser(Email);
    if (user_check.length === 0) {
      return res
        .status(401)
        .json({ message: "The email you have entered is not registered!" });
    }

    const user = user_check[0];

    if (user.Status == 0) {
      return res
        .status(409)
        .json({ message: "The Account is not approved yet!" });
    }

    if (user.Status == 1) {
      return res
        .status(409)
        .json({ message: "The Account is not activated yet!" });
    }

    const passwordMatch = await bcrypt.compare(Password, user.Password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Password you enetered is not correct!" });
    }
    const token = jwt.sign({ idUser: user.idUser }, "secret_key");
    const getDataOfHimIfHeisExist = await authDbService.getDataOfHimIfHeisExist(
      user.idUser
    );
    const user_role = await authDbService.getUserRole(user.idUser);
    let results = "";

    if (getDataOfHimIfHeisExist.length > 0) {
      results = getDataOfHimIfHeisExist;
    } else {
      results = "The user is new to system!:)";
    }
    res.status(201).json({
      token,
      user_role,
      user: {
        email: user.Email,
        name: user.FirstName + " " + user.LastName,
        firstName: user.FirstName,
        lastName: user.LastName,
        address: user.Address,
        userId: user.idUser,
        role: user.Role,
        userDetails: results,
      },
    });
  } catch (err) {
    res.status(401).json({
      Status: "Something went wrong in the login process!",
      error: err.message,
    });
  }
};

const changeUserStatus = async (req, res) => {
  try {
    const { idUser } = req.params;
    const change_result = await authDbService.changeUserStatus(idUser);
    const get_current_user_data = await authDbService.getCurrentUserData(
      idUser
    );
    const email = get_current_user_data[0].Email;
    const name = get_current_user_data[0].FirstName;
    const encryptedID = await makeEncryption(idUser.toString());
    await sendAcountActivationMali(email, name, encryptedID);
    res.status(201).json({ message: "Status changed successfully!" });
  } catch (err) {
    res.status(409).json({
      Status: "Something went wrong when updating the status!",
      error: err.message,
    });
  }
};

const makeEncryption = (text) => {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

const makeDecryption = (encryptedText) => {
  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

const getAllUsers = async (req, res) => {
  try {
    const fetched_results = await authDbService.getAllUsers();
    res.status(201).json(fetched_results);
  } catch (err) {
    res.status(409).json({
      Status: "Something went wrong when fetching users!",
      error: err.message,
    });
  }
};

const sendAcountActivationMali = async (email, name, encryptedID) => {
  const activationDate = new Date();
  const transporter = await nodemailer.createTransport({
    host: "grocerysdirect.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL || "security@grocerysdirect.com",
      pass: process.env.PASSWORD,
    },
  });

  ejs.renderFile(
    path.join(__dirname, "../views/acountActivationTemplate.ejs"),
    {
      email,
      name,
      activationDate,
      encryptedID,
    },
    async (err, data) => {
      if (err) {
        console.log("Err sending the mail", err);
      } else {
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Activate Your Grocery's Direct Account",
          html: data,
        };
        await transporter.sendMail(mailOptions);
        console.log("Email sending completed!");
      }
    }
  );
};

const makeUserActivationByDecreptingId = async (req, res) => {
  try {
    const { activationid } = req.params;
    const idUser = await makeDecryption(activationid);
    if (!idUser) {
      return res.status(409).json({ message: "Id screpting failiur!" });
    }

    const result = await authDbService.updateStatusWhenActivated(idUser);
    if (result.affectedRows == 0) {
      return res.status(409).json({ message: "Validation Error!" });
    }
    res.status(201).json({ message: "User activation completed!" });
  } catch (err) {
    res.status(409).json({
      Status: "Something went wrong when validating the user!",
      error: err.message,
    });
  }
};

module.exports = {
  register,
  checkToken,
  login,
  changeUserStatus,
  getAllUsers,
  makeUserActivationByDecreptingId,
};
