const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    
    if (!data || data.length === 0) {
      return res.status(404).render("errors/404", { title: "Not Found", message: "No vehicles found for this classification." });
    }

    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.getVehicleDetail = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const vehicle = await invModel.getVehicleById(inv_id);
    
    if (!vehicle) {
      return res.status(404).render("errors/404", { title: "Not Found", message: "Vehicle not found" });
    }

    const vehicleHtml = utilities.buildVehicleDetailHTML(vehicle);
    let nav = await utilities.getNav();
    
    res.render("./inventory/detail", {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      nav,
      vehicleHtml,
    });
  } catch (error) {
    next(error);  // Pass error to middleware
  }
};

module.exports = invCont;
