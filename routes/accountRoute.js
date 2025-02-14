// routes/accountRoute.js

const express = require('express');
const router = express.Router();

// Access the utilities
const utilities = require('../utilities'); // Ensure this resolves correctly

// Access the accounts controller
const accountController = require('../controllers/accountController');

// Route to build login view (choose one)
router.get('/login', accountController.buildLoginView);

// Route to build registration view
router.get('/register', accountController.buildRegister);

// Route to post register
router.post('/register', accountController.registerAccount)
// Export the router for use in your main application file
module.exports = router;
