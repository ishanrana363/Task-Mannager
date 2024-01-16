const express = require("express");
const userRoute = express.Router();

const userController = require("../controllers/userController");
const authMiddlewares = require('../middlewares/authMiddlewares')

userRoute.post("/registration",userController.registration);
userRoute.post("/login",userController.login);
userRoute.get("/logout",authMiddlewares,userController.logout);
userRoute.put("/update",authMiddlewares,userController.profileUpdate);



module.exports = userRoute