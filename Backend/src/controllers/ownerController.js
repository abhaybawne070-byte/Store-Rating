const pool = require("../config/db");

const getOwnerDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;

        // Find owner's store
        const storeResult = await pool.query(
            `
            SELECT id, name, email, address
            FROM stores
            WHERE owner_id = $1
            `,
            [ownerId]
        );

        if (storeResult.rows.length === 0) {
            return res.status(404).json({
                message: "No store found for this owner"
            });
        }

        const store = storeResult.rows[0];

        // Get ratings for this store
        const ratingsResult = await pool.query(
            `
            SELECT
                r.id,
                r.rating,
                r.created_at,
                u.id AS user_id,
                u.name AS user_name,
                u.email AS user_email
            FROM ratings r
            JOIN users u
                ON r.user_id = u.id
            WHERE r.store_id = $1
            ORDER BY r.created_at DESC
            `,
            [store.id]
        );

        // Calculate average rating
        const averageResult = await pool.query(
            `
            SELECT
                COUNT(*) AS total_ratings,
                COALESCE(ROUND(AVG(rating), 2), 0) AS average_rating
            FROM ratings
            WHERE store_id = $1
            `,
            [store.id]
        );

        res.json({
            store: store,

            statistics: {
                total_ratings: Number(
                    averageResult.rows[0].total_ratings
                ),
                average_rating: Number(
                    averageResult.rows[0].average_rating
                )
            },

            ratings: ratingsResult.rows
        });

    } catch (error) {
        console.error(
            "Owner dashboard error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to fetch owner dashboard"
        });
    }
};

module.exports = {
    getOwnerDashboard
};