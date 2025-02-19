const pool = require("../database/");


/* *******************
 * Add New Inventory Item
 * ***************** */
async function addInventory(inventoryData) {
    const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id } = inventoryData;
    try {
      const sql = `
        INSERT INTO inventory 
          (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id)
        VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING inv_id;
      `;
      const data = await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id]);
      return data.rows[0];
    } catch (error) {
      console.error("Error adding inventory:", error);
      return null;
    }
  }

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

/* ***************************
 *  Get inventory by classification ID
 * ************************** */
async function getInventoryByClassificationId(classificationId) {
    try {
        console.log("Fetching inventory for classification ID:", classificationId); // ✅ Debugging log
        const data = await pool.query(
            `SELECT * FROM public.inventory WHERE classification_id = $1`, [classificationId]
        );
        return data.rows;
    } catch (error) {
        console.error("getInventoryByClassificationId error:", error);
        throw error;
    }
}

/* ***************************
 *  Get a specific vehicle by inventory ID
 * ************************** */
async function getVehicleById(invId) { // ✅ Fix incorrect variable
    try {
        console.log("Fetching vehicle with ID:", invId); // ✅ Debugging log
        const data = await pool.query(
            `SELECT * FROM public.inventory WHERE inv_id = $1`, [invId] // ✅ Fix incorrect variable
        );
        return data.rows[0]; // ✅ Return a single vehicle object
    } catch (error) {
        console.error("getVehicleById error:", error);
        throw error;
    }
}

module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getVehicleById,
    addInventory
};
