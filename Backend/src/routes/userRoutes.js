const express = require("express");

const router = express.Router();

const {
    getUserStores,
    submitRating,
    updateRating,
    updatePassword
} = require("../controllers/userController");

const {
    authenticate,
    authorizeRoles
} = require("../middleware/authMiddleware");

router.get(
    "/stores",
    authenticate,
    authorizeRoles("USER"),
    getUserStores
);

router.post(
    "/ratings",
    authenticate,
    authorizeRoles("USER"),
    submitRating
);

router.put(
    "/ratings/:storeId",
    authenticate,
    authorizeRoles("USER"),
    updateRating
);

router.put(
    "/password",
    authenticate,
    authorizeRoles("USER"),
    updatePassword
);

module.exports = router;