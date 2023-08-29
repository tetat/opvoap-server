const express = require("express");
// internal imports
const userController = require("../controller/userController");
const { isUser, isAdmin } = require("../middleware/userMiddleware");

const router = express.Router();

// users section
router.post("/signup", userController.signUp);
router.post("/login", userController.logIn);
router.get("/logout", isUser, userController.logOut);
router.get("/admins", userController.admins);
router.get("/myproducts", isAdmin, userController.getMe);
router.get("/curuser", isUser, userController.currentUser);

module.exports = router;
