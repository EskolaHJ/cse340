// Needed Resources 
const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation"); // if you have validation for inventory & classification

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

module.exports = router;
