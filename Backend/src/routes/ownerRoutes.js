const express = require("express");

const router = express.Router();

const {
    getOwnerDashboard
} = require("../controllers/ownerController");

const {
    authenticate,
    authorizeRoles
} = require("../middleware/authMiddleware");


router.get(
    "/dashboard",
    authenticate,
    authorizeRoles("OWNER"),
    getOwnerDashboard
);


module.exports = router;