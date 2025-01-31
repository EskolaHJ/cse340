const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classificationId = req.params.classificationId; // ✅ Consistent naming
    console.log("Classification ID received:", classificationId); // ✅ Debugging log

    const data = await invModel.getInventoryByClassificationId(classificationId);

    if (!data || data.length === 0) {
      console.warn("No vehicles found for classification:", classificationId);
      return res.status(404).render("errors/404", { 
        title: "Not Found", 
        message: "No vehicles found for this classification." 
      });
    }

    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;

    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    });
  } catch (error) {
    console.error("Error fetching classification inventory:", error);
    next(error);
  }
};

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.getVehicleDetail = async function (req, res, next) {
  try {
    const invId = req.params.invId; // ✅ Use the correct parameter name
    console.log("Vehicle ID received:", invId); // ✅ Debugging log

    if (!invId) {
      console.error("Error: Missing invId");
      return res.status(400).send("Invalid vehicle ID.");
    }

    const vehicle = await invModel.getVehicleById(invId); // ✅ Use invId
    console.log("Vehicle retrieved from DB:", vehicle); // ✅ Log fetched data

    if (!vehicle) {
      console.warn("Vehicle not found in DB, ID:", invId);
      return res.status(404).render("errors/404", { 
        title: "Not Found", 
        message: "Vehicle not found" 
      });
    }

    let nav = await utilities.getNav();

    console.log("Rendering details.ejs for:", vehicle.inv_make, vehicle.inv_model);


    res.render("inventory/details", {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle, // ✅ Pass vehicle directly to EJS
    });
  } catch (error) {
    console.error("Error fetching vehicle details:", error);
    next(error);
  }
};

module.exports = invCont;
