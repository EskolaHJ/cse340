// Needed Resources 
const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation"); // if you have validation for inventory & classification
const utilities = require("../utilities/")
// ===========================
// Management Routes (Task One)
// ===========================

// Route to build the management view
router.get("/", invController.buildManagement);

// ================================
// Add Classification Routes (Task Two)
// ================================

// GET: Display the Add Classification form
router.get("/add-classification", invController.buildAddClassification);

// POST: Process the Add Classification form
// (Assuming you have validation middleware for classification in invValidate; otherwise, remove these middleware functions)
router.post(
  "/add-classification",
  invValidate.classificationRules ? invValidate.classificationRules() : (req, res, next) => { next(); },
  invValidate.checkClassificationData ? invValidate.checkClassificationData : (req, res, next) => { next(); },
  invController.processAddClassification
);

// ================================
// Add Inventory Routes (Task Three)
// ================================

// GET: Display the Add Inventory form
router.get("/add-inventory", invController.buildAddInventory);

// POST: Process the Add Inventory form
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  invController.processAddInventory
);

// ================================
// Existing Routes
// ================================

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to get vehicle details by ID
router.get("/detail/:invId", invController.getVehicleDetail);

/* *****************************
 * New Inventory JSON Data Route
 ***************************** */
// This route will be called by your JavaScript to return inventory data as JSON.
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

/*****************************
 * New Delete Inventory Routes
 * ***************************/
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteView))

// Post: Process the deletion of an inventory item
router.post("/delete", utilities.handleErrors(invController.deleteInventoryItem))

/**************************
 * New Modify Inventory Route
 ************************ */
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))

module.exports = router;
