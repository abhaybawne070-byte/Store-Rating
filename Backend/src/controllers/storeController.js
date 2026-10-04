const pool = require("../config/db");

const getStores = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM stores ORDER BY id ASC"
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Error fetching stores:", error.message);

        res.status(500).json({
            message: "Failed to fetch stores"
        });
    }
};

module.exports = {
    getStores
};