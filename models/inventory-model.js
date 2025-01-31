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
    getVehicleById
};
