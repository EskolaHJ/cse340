// Needed Resources
const express = require("express")
const route = new express.Router()
const invController = require("../controllers/invController")

// Route to build inventory by classification view
route.get("/type/:classificationID",  invController.buildByClassificationID);

module.exports = router; 