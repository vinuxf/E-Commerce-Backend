const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const toolDbService = require("../services/toolDbService");

const sendEmail = async ({
  email,
  name,
  item_id,
  orderItems,
  subtotal,
  paymentMethod,
  total,
  Discount,
}) => {
  try {
    console.log("The email is : ", email);
    console.log("The order items : ", orderItems);
    const orderDate = new Date();

    // Setup transporter for sending emails
    const transporter = await nodemailer.createTransport({
      host: "grocerysdirect.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL || "security@grocerysdirect.com", // Email credentials
        pass: process.env.PASSWORD, // Email password from environment variables
      },
    });

    // Get currency from database
    const currencyType = await toolDbService.getCurrencyType();
    const currency = currencyType[0].Currency;

    // Render the email template using EJS
    const emailTemplatePath = path.join(
      __dirname,
      "../views/emailTemplate.ejs"
    );
    console.log("orderItems from emailcontroller : ", orderItems);
    const emailHtml = await ejs.renderFile(emailTemplatePath, {
      email,
      name,
      item_id,
      orderDate,
      orderItems,
      subtotal,
      paymentMethod,
      total,
      currency,
      Discount,
    });

    // Create the email options
    const mailOptions = {
      from: process.env.EMAIL, // Sender email
      to: email, // Recipient email
      subject: "Your Order is Placed ... Be happy :)",
      html: emailHtml, // Rendered HTML from EJS
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return success message, no need to use res.status here
    return { success: true, message: "Email sent successfully!" };
  } catch (err) {
    // Return error message on failure
    console.log("THe error is : ", err);
    return {
      success: false,
      message: "Something went wrong when sending the email!",
      error: err.message,
    };
  }
};

const sendEmailForAdmin = async ({
  email,
  name,
  item_id,
  orderItems,
  subtotal,
  paymentMethod,
  total,
  Discount,
}) => {
  try {
    const orderDate = new Date();
    // Setup transporter for sending emails
    const transporter = await nodemailer.createTransport({
      host: "grocerysdirect.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL || "testing@leofoodslk.com", // Email credentials
        pass: process.env.PASSWORD, // Email password from environment variables
      },
    });

    // Get currency from database
    const currencyType = await toolDbService.getCurrencyType();
    const currency = currencyType[0].Currency;

    // Render the email template using EJS
    const emailTemplatePath = path.join(
      __dirname,
      "../views/adminEmailTemplate.ejs"
    );
    const emailHtml = await ejs.renderFile(emailTemplatePath, {
      email,
      name,
      item_id,
      orderDate,
      orderItems,
      subtotal,
      paymentMethod,
      total,
      currency,
      Discount,
    });

    // Add the recipient emails (can be an array or a string of emails separated by commas)
    const recipientEmails = [
      process.env.EMAIL, // Primary email
      "grocerysdirect03@gmail.com",
      "chriscamaroon@gmail.com",
      "odessaedward@gmail.com",
      "promo4logo@gmail.com",
    ];

    // Create the email options
    const mailOptions = {
      from: process.env.EMAIL, // Sender email
      to: recipientEmails, // Multiple recipients
      subject: "New Order Received :)",
      html: emailHtml, // Rendered HTML from EJS
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return success message, no need to use res.status here
    return { success: true, message: "Email sent successfully!" };
  } catch (err) {
    // Return error message on failure
    console.log("The error is: ", err);
    return {
      success: false,
      message: "Something went wrong when sending the email!",
      error: err.message,
    };
  }
};

const sendRegistrationEmail = async ({ adminEmail, name, email }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "grocerysdirect.com",
      port: process.env.EMAIL_PORT || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL || "security@grocerysdirect.com",
        pass: process.env.PASSWORD,
      },
    });

    const emailTemplatePath = path.join(
      __dirname,
      "../views/newUserRegisteredTemplate.ejs"
    );

    console.log("Template path:", emailTemplatePath);

    const emailHtml = await ejs.renderFile(emailTemplatePath, {
      name,
      email,
      registrationDate: new Date().toLocaleDateString(),
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: adminEmail,
      subject: `New Customer Registered: ${name}`,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    console.log("Registration email sent successfully!");
  } catch (err) {
    console.error("Error sending registration email:", err.message);
    throw new Error("Failed to send the registration email.");
  }
};

module.exports = {
  sendEmail,
  sendEmailForAdmin,
  sendRegistrationEmail,
};
