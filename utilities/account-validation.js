const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const accountModel = require('../models/account-model');

/* **********************************
 * Registration Data Validation Rules
 * **********************************/
validate.registrationRule = () => {
  return [
    // account_firstname is required
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),
    // account_lastname is required
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),
    // account_email is required, must be valid, and not already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email);
        if (emailExists) {
          throw new Error("Email exists. Please log in or use a different email.");
        }
      }),
    // account_password is required and must be strong
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ***********************************
 * Check registration data and return errors or continue to registration
 *********************************** */
validate.checkRegData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email } = req.body;
    res.render("account/register", {
      errors: errors.array(),
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* **********************************
 * Account Update Data Validation Rules
 * **********************************/
validate.accountUpdateRules = () => {
  return [
    // First name is required
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name."),
    // Last name is required
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name."),
    // Email is required and must be valid.
    // Optionally, you can add a custom check to ensure the new email is not already in use
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id;
        const emailExists = await accountModel.checkExistingEmail(account_email);
        if (emailExists) {
          // Optionally, compare the account_id of the found email with the one being updated.
          throw new Error("Email exists. Please use a different email.");
        }
      }),
  ];
};

/* ***********************************
 * Check account update data and return errors or continue
 *********************************** */
validate.checkAccountUpdateData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const { account_id, account_firstname, account_lastname, account_email } = req.body;
    res.status(400).render("account/update-account", {
      errors: errors.array(),
      title: "Update Account Information",
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      message: null,
    });
    return;
  }
  next();
};

/* **********************************
 * Password Change Validation Rules
 * **********************************/
validate.passwordChangeRules = () => {
  return [
    body("new_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        // Optionally enforce symbols
      })
      .withMessage("Password must be at least 8 characters long and contain a mix of letters and numbers."),
  ];
};

/* ***********************************
 * Check password change data and return errors or continue
 *********************************** */
validate.checkPasswordChangeData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const { account_id, account_firstname, account_lastname, account_email } = req.body;
    res.status(400).render("account/update-account", {
      errors: errors.array(),
      title: "Update Account Information",
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      message: null,
    });
    return;
  }
  next();
};

/* **********************************
 * Login Data Validation Rules
 * **********************************/
validate.loginRules = () => {
  return [
    // Validate the email
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
    // Validate the password is provided
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Please provide a password.")
  ];
};

/* ***********************************
 * Check login data and return errors or continue
 *********************************** */
validate.checkLoginData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const { account_email } = req.body;
    res.status(400).render("account/login", {
      errors: errors.array(),
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};

module.exports = validate;
