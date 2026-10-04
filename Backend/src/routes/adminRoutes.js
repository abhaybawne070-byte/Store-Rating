const express = require("express");

const router = express.Router();

const {
    adminTest,
    getDashboardStats,
    getUsers,
    getAdminStores,
    createStore
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

router.get(
    "/stores",
    authenticate,
    authorizeRoles("ADMIN"),
    getAdminStores
);

router.post(
    "/stores",
    authenticate,
    authorizeRoles("ADMIN"),
    createStore
);



module.exports = router;