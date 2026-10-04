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
        const {
            name,
            email,
            address,
            role,
            sortBy = "id",
            order = "asc"
        } = req.query;

        let query = `
            SELECT id, name, email, address, role
            FROM users
            WHERE 1=1
        `;

        const values = [];
        let index = 1;

        // Name search
        if (name) {
            query += ` AND name ILIKE $${index}`;
            values.push(`%${name}%`);
            index++;
        }

        // Email search
        if (email) {
            query += ` AND email ILIKE $${index}`;
            values.push(`%${email}%`);
            index++;
        }

        // Address search
        if (address) {
            query += ` AND address ILIKE $${index}`;
            values.push(`%${address}%`);
            index++;
        }

        // Role filter
        if (role) {
            query += ` AND role = $${index}`;
            values.push(role.toUpperCase());
            index++;
        }

        // Allowed sorting columns
        const allowedSortColumns = {
            id: "id",
            name: "name",
            email: "email",
            address: "address",
            role: "role"
        };

        const selectedColumn =
            allowedSortColumns[sortBy] || "id";

        const selectedOrder =
            order.toLowerCase() === "desc"
                ? "DESC"
                : "ASC";

        query += ` ORDER BY ${selectedColumn} ${selectedOrder}`;

        const result = await pool.query(query, values);

        res.json(result.rows);

    } catch (error) {
        console.error("Get users error:", error.message);

        res.status(500).json({
            message: "Failed to fetch users"
        });
    }
};

const getAdminStores = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            sortBy = "id",
            order = "asc"
        } = req.query;

        let query = `
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id,
                COALESCE(ROUND(AVG(r.rating), 2), 0) AS rating
            FROM stores s
            LEFT JOIN ratings r
                ON s.id = r.store_id
            WHERE 1=1
        `;

        const values = [];
        let index = 1;

        // Search by store name
        if (name) {
            query += ` AND s.name ILIKE $${index}`;
            values.push(`%${name}%`);
            index++;
        }

        // Search by email
        if (email) {
            query += ` AND s.email ILIKE $${index}`;
            values.push(`%${email}%`);
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
                s.address,
                s.owner_id
        `;

        const allowedSortColumns = {
            id: "s.id",
            name: "s.name",
            email: "s.email",
            address: "s.address",
            rating: "rating"
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
        console.error("Get admin stores error:", error.message);

        res.status(500).json({
            message: "Failed to fetch stores"
        });
    }
};

const createStore = async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            owner_id
        } = req.body;

        if (!name || !email || !address) {
            return res.status(400).json({
                message: "Name, email and address are required"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO stores
            (name, email, address, owner_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                name,
                email,
                address,
                owner_id || null
            ]
        );

        res.status(201).json({
            message: "Store created successfully",
            store: result.rows[0]
        });

    } catch (error) {
        console.error("Create store error:", error.message);

        res.status(500).json({
            message: "Failed to create store"
        });
    }
};


module.exports = {
    adminTest,
    getDashboardStats,
    getUsers,
    getAdminStores,
    createStore
};