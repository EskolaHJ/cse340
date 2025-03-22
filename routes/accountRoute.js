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

// Route to display the account update view
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateView))

// Route to process account information update
router.post(
    "/update-info",
    regValidate.accountUpdateRules(),
    regValidate.checkAccountUpdateData,
    utilities.handleErrors(accountController.updateAccountInfo)
)

// Route to process password change
router.post(
    "/change-password",
    regValidate.passwordChangeRules(),
    regValidate.checkPasswordChangeData,
    utilities.handleErrors(accountController.changePassword)
)

// Route to logout
router.get("/logout", (req, res) => {
    res.clearCookie("token")
    req.flash("notice", "You have been logged out.")
    res.redirect("/")
})

// Export the router for use in your main application file
module.exports = router;
