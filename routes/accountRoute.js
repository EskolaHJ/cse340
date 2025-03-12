// routes/accountRoute.js

const express = require('express');
const router = express.Router();
const regValidate = require('../utilities/account-validation')

// Access the utilities
const utilities = require('../utilities'); // Ensure this resolves correctly

// Access the accounts controller
const accountController = require('../controllers/accountController');

// Default route for account management with checkLogin middleware
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

// Route to build login view (choose one)
router.get('/login', accountController.buildLoginView);

// Route to build registration view
router.get('/register', accountController.buildRegister);

// Route to post register
// router.post('/register', accountController.registerAccount)

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRule(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
router.post(
    "/login",
    (req, res) => {
        res.status(200).send('login process')
    }
)

// Export the router for use in your main application file
module.exports = router;
