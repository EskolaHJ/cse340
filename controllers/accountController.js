// controllers/accountController.js

// Require the utilities module
const utilities = require('../utilities');

// Require account-model
const accountModel = require('../models/account-model')

// Require bcryptjs package
const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken");

require("dotenv").config()

/* ******************************
 * Deliver login view
 * ******************************/
async function buildLoginView(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/login', {
    title: "Login",
    nav,
    errors: null,
  });
}


/* ********************************
 * Deliver registration view
 * ********************************/
async function buildRegister(req,res,next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ******************************
 *  Process Registration
 * **************************** */
async function registerAccount(req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password} = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* **********************************
 * Build Account Update View
 * **********************************
 * Renders a view that allows a user to update their account information
 * and change their password.
 */
async function buildUpdateView(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const account_id = req.params.account_id;
    // Query the account data using the model (make sure getAccountById is defined in your model)
    const accountData = await accountModel.getAccountById(account_id);
    if (!accountData) {
      req.flash("notice", "Account not found.");
      return res.redirect("/account");
    }
    res.render("account/update-account", {
      title: "Update Account Information",
      nav,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      errors: null,
      message: null,
    });
  } catch (error) {
    next(error);
  }
}

/* **********************************
 * Build Account Management View
 * **********************************
 * Renders the account management view.
 */
async function buildManagement(req, res, next) {
  try {
    let nav = await utilities.getNav();
    // Assuming you store the logged-in user's info (perhaps set by your JWT middleware) in res.locals
    const user = res.locals.accountData || {};
    res.render("account/manage", {
      title: "Account Management",
      nav,
      user,
      errors: null,
    });
  } catch (error) {
    console.error("Error in buildManagement:", error);
    next(error);
  }
}


/* **********************************
 * Update Account Information
 * **********************************
 * Processes the update of a user's account information (first name, last name, email).
 */
async function updateAccountInfo(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_id, account_firstname, account_lastname, account_email } = req.body;
    // Call the model function to update account info (ensure updateAccountInfo exists in your model)
    const updateResult = await accountModel.updateAccountInfo(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );
    if (updateResult) {
      req.flash("notice", "Account information updated successfully.");
      res.redirect("/account");
    } else {
      req.flash("notice", "Account update failed.");
      res.redirect(`/account/update/${account_id}`);
    }
  } catch (error) {
    next(error);
  }
}

/* **********************************
 * Change Password
 * **********************************
 * Processes the password change by hashing the new password
 * and updating it in the database.
 */
async function changePassword(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_id, new_password } = req.body;
    // Hash the new password (using bcrypt)
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hashSync(new_password, 10);
    } catch (error) {
      req.flash("notice", "Error hashing the password.");
      return res.redirect(`/account/update/${account_id}`);
    }
    // Call the model function to update the password (ensure updatePassword exists in your model)
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);
    if (updateResult) {
      req.flash("notice", "Password updated successfully.");
      res.redirect("/account");
    } else {
      req.flash("notice", "Password update failed.");
      res.redirect(`/account/update/${account_id}`);
    }
  } catch (error) {
    next(error);
  }
}

/* ********************************
 * Process Login Request
 * ********************************
 * Authenticates the user, creates a JWT, and sets it as a cookie.
 */
async function accountLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;

    // Fetch account data based on the email provided
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }

    // Compare the provided password with the stored hashed password
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      // Remove the password from the data for security
      delete accountData.account_password;

      // Create a JWT token with the account data as the payload
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
      
      // Set the JWT in a cookie; use 'secure: true' in production
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      
      // Redirect to the account management view
      return res.redirect("/account");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { 
  buildLoginView, 
  buildRegister, 
  registerAccount, 
  buildUpdateView, 
  updateAccountInfo, 
  changePassword,
  buildManagement,
  accountLogin
};
