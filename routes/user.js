const express = require("express");
const { User } = require("../models/User");
const { handleGetallUser, handleCreateUser, handleDeleteUser, handleLogin, getCurrentUser } = require("../controllers/userController");
const { createAdmin } = require("../seeders/userSeeder");
const { checkAuth } = require("../moddlewares/checkauth");
const router = express.Router();

router.get("/", checkAuth, handleGetallUser);
router.post("/", handleCreateUser);
router.delete("/:id", checkAuth, handleDeleteUser).get("/:id", getCurrentUser);
router.post("/login", handleLogin);
router.get('/create/admin', createAdmin);

module.exports = router;