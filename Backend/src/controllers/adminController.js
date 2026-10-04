const pool = require("../config/db");

const adminTest = (req, res) => {
    res.json({
        message: "Welcome Admin",
        user: req.user
    });
};


const getDashboardStats = async (req, res) => {
    try {

        const usersResult = await pool.query(
            "SELECT COUNT(*) FROM users"
        );

        const storesResult = await pool.query(
            "SELECT COUNT(*) FROM stores"
        );

        const ratingsResult = await pool.query(
            "SELECT COUNT(*) FROM ratings"
        );

        res.json({
            totalUsers: Number(usersResult.rows[0].count),
            totalStores: Number(storesResult.rows[0].count),
            totalRatings: Number(ratingsResult.rows[0].count)
        });

    } catch (error) {

        console.error("Dashboard error:", error.message);

        res.status(500).json({
            message: "Failed to fetch dashboard statistics"
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name, email, address, role
            FROM users
            ORDER BY id ASC
        `);

        res.json(result.rows);

    } catch (error) {
        console.error("Get users error:", error.message);

        res.status(500).json({
            message: "Failed to fetch users"
        });
    }
};


module.exports = {
    adminTest,
    getDashboardStats,
    getUsers
};