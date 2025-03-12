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

/* ****************************
 *  Build Management View (Task One)
 * **************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      messages: req.flash("notice")
    });
  } catch (error) {
    next(error);
  }
};



/* ------------------------------
   Build Add Inventory View (Task Three)
------------------------------ */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    // Build the classification dropdown list
    let classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      classificationList,
      errors: null,
      // Initialize sticky fields as empty strings
      inv_make: "",
      inv_model: "",
      inv_description: "",
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image-tn.png",
      inv_price: "",
      inv_year: "",
      inv_miles: "",
      inv_color: ""
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************
 *  Build Add Classification View (Task Two)
 * **************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name: ""
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************
 *  Process Add Classification (Task Two)
 * **************************** */
invCont.processAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { classification_name } = req.body;
    const result = await invModel.addClassification(classification_name);
    if (result) {
      req.flash("notice", "New classification added successfully.");
      res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        messages: req.flash("notice")
      });
    } else {
      req.flash("notice", "Sorry, classification could not be added.");
      res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        classification_name
      });
    }
  } catch (error) {
    next(error);
  }
};


/* ------------------------------
   Process Add Inventory Form (Task Three)
------------------------------ */
invCont.processAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    // Destructure form data from req.body (using the same names as the database fields)
    const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body;
    const result = await invModel.addInventory({
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    });
    if (result) {
      req.flash("notice", "New vehicle added successfully.");
      res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        messages: req.flash("notice")
      });
    } else {
      req.flash("notice", "Sorry, the new vehicle could not be added.");
      // Rebuild the classification list with the selected classification for stickiness
      let classificationList = await utilities.buildClassificationList(classification_id);
      res.render("inventory/add-inventory", {
        title: "Add New Inventory Item",
        nav,
        errors: null,
        classificationList,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
      });
    }
  } catch (error) {
    next(error);
  }
};


/* ***************************
 * Return Inventory by Classification As JSOn
 *************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invCont;
