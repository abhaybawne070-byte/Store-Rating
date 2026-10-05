const express = require("express");

const router = express.Router();

const {
    adminTest,
    getDashboardStats,
    getUsers,
    getAdminStores,
    createStore,
    deleteStore,
    updateStore
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

router.delete(
    "/stores/:id",
    authenticate,
    authorizeRoles("ADMIN"),
    deleteStore
);

router.put(
    "/stores/:id",
    authenticate,
    authorizeRoles("ADMIN"),
    updateStore
);


module.exports = router;