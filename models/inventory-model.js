const invModel = require("../models/inventory-model");
const Util = {};
const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    try {
        const result = await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
        return result.rows;
    } catch (error) {
        console.error("getClassifications error:", error);
        throw error;
    }
}

module.exports = {
    getClassifications
};


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid = "";

  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach(vehicle => {
      grid += '<li>';
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' details"><img src="' + (vehicle.inv_image.startsWith('/') ? vehicle.inv_image : '/images/' + vehicle.inv_image)
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += '<h2>';
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>';
      grid += '</h2>';
      grid += '<span>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  return grid;
};

/* **************************************
 * Build the vehicle detail HTML
 * ************************************ */
Util.buildVehicleDetailHTML = function (vehicle) {
  return `
    <div class="vehicle-detail">
        <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
        <div class="vehicle-layout">
            <img src="${vehicle.inv_image.startsWith('/') ? vehicle.inv_image : '/images/' + vehicle.inv_image}" 
                 alt="${vehicle.inv_make} ${vehicle.inv_model}">
            <div class="vehicle-info">
                <p><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</p>
                <p><strong>Mileage:</strong> ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)} miles</p>
                <p><strong>Color:</strong> ${vehicle.inv_color}</p>
                <p><strong>Description:</strong> ${vehicle.inv_description}</p>
            </div>
        </div>
    </div>
  `;
};

module.exports = Util;
