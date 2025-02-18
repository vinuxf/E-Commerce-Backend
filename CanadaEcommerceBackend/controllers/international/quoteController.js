const quoteService = require("../../services/international/quoteService");
const sendEmail = require("../international/emailService");
require("dotenv").config();
const ejs = require("ejs");
const path = require("path");

// create
const createQuoteRequest = async (req, res) => {
  try {
    const { name, company_name, phone_number, email, product, quantity } =
      req.body;
    if (!name || !email || !product || !quantity) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    const newQuote = await quoteService.addQuoteRequest(
      name,
      company_name,
      phone_number,
      email,
      product,
      quantity
    );

    res
      .status(201)
      .json({ message: "Quote request created successfully!", data: newQuote });

    // Prepare email content
    const htmlContentUser = `
  <div style="
    max-width: 600px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  ">
    <div style="
      background-color: #4CAF50;
      color: white;
      padding: 16px;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
    ">
      Thank You for Your Quote Request!
    </div>
    <div style="
      padding: 16px;
      color: #333;
      font-size: 16px;
      line-height: 1.5;
    ">
      <p>We have received your request for the following quotation:</p>
      <div style="
        margin: 16px 0;
        padding: 16px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
      ">
        <p><strong>Product:</strong> ${product}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
      </div>
      <p>Our team will get back to you shortly with further details.</p>
    </div>
  </div>
`;

    const emailTextClient = `
  <div style="
    max-width: 600px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  ">
    <div style="
      background-color: #008cff;
      color: white;
      padding: 16px;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
    ">
      A New Quote Request Has Been Submitted
    </div>
    <div style="
      padding: 16px;
      color: #333;
      font-size: 16px;
      line-height: 1.5;
    ">
      <p>Details of the submitted quotation:</p>
      <div style="
        margin: 16px 0;
        padding: 16px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
      ">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company_name || "N/A"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone_number || "N/A"}</p>
        <p><strong>Product:</strong> ${product}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
      </div>
      <p>Please review and take necessary actions.</p>
    </div>
  </div>
`;

    // Send email to the user and client
    await sendEmail(
      email,
      "Quote Request Received",
      htmlContentUser,
      emailTextClient
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// fetch all
const getAllQuoteRequests = async (req, res) => {
  try {
    const quoteRequests = await quoteService.getQuoteRequests();
    res.status(200).json({ data: quoteRequests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  send quotation email
const sendQuotation = async (req, res) => {
  const {
    email,
    customerName,
    quotationId,
    quotedItems,
    totalAmount,
    validityPeriod,
    notes,
  } = req.body;

  try {
    // Path to your EJS email template
    const emailTemplatePath = path.join(
      __dirname,
      "../../views/quotationTemplate.ejs"
    );
    console.log("Email template path:", emailTemplatePath);

    // Render EJS template into HTML
    const emailHtml = await ejs.renderFile(emailTemplatePath, {
      quotationId,
      customerName,
      quotedItems,
      totalAmount,
      validityPeriod,
      notes,
    });

    if (emailResponse.success) {
      return res.status(200).json({
        success: true,
        message: "Quotation sent successfully!",
      });
    } else {
      throw new Error(emailResponse.message);
    }
  } catch (error) {
    console.error("Error sending quotation email:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to send the quotation email.",
      error: error.message,
    });
  }
};

const updateQuotationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    const result = await quoteService.updateStatus(id, status);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    res.status(200).json({ message: "Quotation status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createQuoteRequest,
  getAllQuoteRequests,
  sendQuotation,
  updateQuotationStatus,
};
