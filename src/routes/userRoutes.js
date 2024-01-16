const express = require("express");
const userRoute = express.Router();

const userController = require("../controllers/userController");

userRoute.post("/registration",userController.registration)


module.exports = userRoute