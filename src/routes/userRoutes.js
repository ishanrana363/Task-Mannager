const express = require("express");
const userRoute = express.Router();

const userController = require("../controllers/userController");

userRoute.post("/registration",userController.registration);
userRoute.post("/login",userController.login);


module.exports = userRoute