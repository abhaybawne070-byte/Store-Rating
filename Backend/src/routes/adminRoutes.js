const express = require("express");

const router = express.Router();

const {
    adminTest,
    getDashboardStats,
    getUsers
} = require("../controllers/adminController");

const {
    authenticate,
    authorizeRoles
} = require("../middleware/authMiddleware");

router.get(
    "/test",
    authenticate,
    authorizeRoles("ADMIN"),
    adminTest
);

router.get(
    "/dashboard",
    authenticate,
    authorizeRoles("ADMIN"),
    getDashboardStats
);

router.get(
    "/users",
    authenticate,
    authorizeRoles("ADMIN"),
    getUsers
);

module.exports = router;