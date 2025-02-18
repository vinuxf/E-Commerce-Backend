const express = require('express');
const router = express.Router();
const quoteController = require('../../controllers/international/quoteController');

// Route to create a new quote request
router.post('/quote-request', quoteController.createQuoteRequest);

// Route to fetch all quote requests
router.get('/quote-requests', quoteController.getAllQuoteRequests);

router.post('/send-quotation', quoteController.sendQuotation );
router.patch('/update-status/:id', quoteController.updateQuotationStatus);


module.exports = router;
