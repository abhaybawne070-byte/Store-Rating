const pool = require("../config/db");
const bcrypt = require("bcrypt");


const getUserStores = async (req, res) => {
    try {
        const {
            name,
            address,
            sortBy = "id",
            order = "asc"
        } = req.query;

        const userId = req.user.id;

        let query = `
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,

                COALESCE(
                    ROUND(AVG(r.rating), 2),
                    0
                ) AS overall_rating,

                MAX(
                    CASE
                        WHEN r.user_id = $1
                        THEN r.rating
                    END
                ) AS my_rating

            FROM stores s

            LEFT JOIN ratings r
                ON s.id = r.store_id

            WHERE 1=1
        `;

        const values = [userId];
        let index = 2;

        // Search by store name
        if (name) {
            query += ` AND s.name ILIKE $${index}`;
            values.push(`%${name}%`);
            index++;
        }

        // Search by address
        if (address) {
            query += ` AND s.address ILIKE $${index}`;
            values.push(`%${address}%`);
            index++;
        }

        query += `
            GROUP BY
                s.id,
                s.name,
                s.email,
                s.address
        `;

        const allowedSortColumns = {
            id: "s.id",
            name: "s.name",
            address: "s.address",
            rating: "overall_rating"
        };

        const selectedColumn =
            allowedSortColumns[sortBy] || "s.id";

        const selectedOrder =
            order.toLowerCase() === "desc"
                ? "DESC"
                : "ASC";

        query += ` ORDER BY ${selectedColumn} ${selectedOrder}`;

        const result = await pool.query(query, values);

        res.json(result.rows);

    } catch (error) {
        console.error("Get user stores error:", error.message);

        res.status(500).json({
            message: "Failed to fetch stores"
        });
    }
};

const submitRating = async (req, res) => {
    try {
        const { store_id, rating } = req.body;

        const user_id = req.user.id;

        // Check required fields
        if (!store_id || rating === undefined) {
            return res.status(400).json({
                message: "store_id and rating are required"
            });
        }

        // Rating must be 1 to 5
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        // Check store exists
        const storeResult = await pool.query(
            "SELECT id FROM stores WHERE id = $1",
            [store_id]
        );

        if (storeResult.rows.length === 0) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        // Insert rating
        const result = await pool.query(
            `
            INSERT INTO ratings (user_id, store_id, rating)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [user_id, store_id, rating]
        );

        res.status(201).json({
            message: "Rating submitted successfully",
            rating: result.rows[0]
        });

    } catch (error) {
        console.error("Submit rating error:", error.message);

        // Duplicate rating
        if (error.code === "23505") {
            return res.status(409).json({
                message: "You have already rated this store"
            });
        }

        res.status(500).json({
            message: "Failed to submit rating"
        });
    }
};

const updateRating = async (req, res) => {
    try {
        const { storeId } = req.params;
        const { rating } = req.body;

        const userId = req.user.id;

        // Check rating
        if (rating === undefined) {
            return res.status(400).json({
                message: "Rating is required"
            });
        }

        // Rating must be 1 to 5
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        // Check whether this user has already rated this store
        const existingRating = await pool.query(
            `
            SELECT id
            FROM ratings
            WHERE user_id = $1
            AND store_id = $2
            `,
            [userId, storeId]
        );

        if (existingRating.rows.length === 0) {
            return res.status(404).json({
                message: "You have not rated this store yet"
            });
        }

        // Update rating
        const result = await pool.query(
            `
            UPDATE ratings
            SET rating = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $2
            AND store_id = $3
            RETURNING *
            `,
            [rating, userId, storeId]
        );

        res.json({
            message: "Rating updated successfully",
            rating: result.rows[0]
        });

    } catch (error) {
        console.error("Update rating error:", error.message);

        res.status(500).json({
            message: "Failed to update rating"
        });
    }
};

const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            currentPassword,
            newPassword
        } = req.body;

        // Check fields
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required"
            });
        }

        // Check new password length
        if (newPassword.length < 8) {
            return res.status(400).json({
                message: "New password must be at least 8 characters"
            });
        }

        // Get current password from database
        const result = await pool.query(
            `
            SELECT password
            FROM users
            WHERE id = $1
            `,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const hashedPassword = result.rows[0].password;

        // Compare current password
        const isMatch = await bcrypt.compare(
            currentPassword,
            hashedPassword
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Current password is incorrect"
            });
        }

        // Hash new password
        const newHashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        // Update password
        await pool.query(
            `
            UPDATE users
            SET password = $1
            WHERE id = $2
            `,
            [newHashedPassword, userId]
        );

        res.json({
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error("Update password error:", error.message);

        res.status(500).json({
            message: "Failed to update password"
        });
    }
};

module.exports = {
    getUserStores,
    submitRating,
    updateRating,
    updatePassword
};