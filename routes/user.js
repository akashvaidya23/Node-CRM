const express = require("express");
const { User } = require("../models/User");
const { handleGetallUser, handleCreateUser, handleDeleteUser, handleLogin } = require("../controllers/userController");
const router = express.Router();

router.get("/", handleGetallUser);

router.post("/", handleCreateUser);

router.delete("/:id", handleDeleteUser);

router.post("/login", handleLogin);

module.exports = router;