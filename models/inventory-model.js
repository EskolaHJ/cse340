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

/* ***************************
 * Delete Inventory Item
 * ***************************
 * Deletes an inventory item based on the provided inv_id.
 */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1';
    const data = await pool.query(sql, [inv_id]);
    return data; // data.rowCount should indicate the number of rows affected
  } catch (error) {
    throw new Error("Delete Inventory Error: " + error.message);
  }
}


/*****************************
 * Add New Classification
 * ***************************/
async function addClassification(classification_name) {
    try {
      const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING classification_id";
      const result = await pool.query(sql, [classification_name]);
      return result.rows[0];
    } catch (error) {
      console.error("Error adding classification:", error);
      return null;
    }
  }

module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getVehicleById,
    addInventory,
    addClassification,
    deleteInventoryItem
};
