const { body, validationResult } = require("express-validator");
const validate = {};

/* **********************************
 * Inventory Data Validation Rules
 * ******************************** */
validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle make is required."),
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle model is required."),
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle description is required."),
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Price must be numeric."),
    body("inv_stock")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Stock must be an integer."),
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle color is required."),
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please choose a classification.")
  ];
};

/* **********************************
 * Check Inventory Data and return errors or continue to registration
 * ******************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_description, inv_price, inv_stock, inv_color, classification_id } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await require("./index").getNav(); // Adjust if needed
    let classificationList = await require("./index").buildClassificationList(classification_id);
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory Item",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_description,
      inv_price,
      inv_stock,
      inv_color
    });
    return;
  }
  next();
};

module.exports = validate;
