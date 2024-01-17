const express = require("express");
const userRoute = express.Router();

const userController = require("../controllers/userController");
const authMiddlewares = require('../middlewares/authMiddlewares');
const taskController = require("../controllers/taskController")

// User Controller Otp

userRoute.post("/registration",userController.registration);
userRoute.post("/login",userController.login);
userRoute.get("/logout",authMiddlewares,userController.logout);
userRoute.put("/update",authMiddlewares,userController.profileUpdate);
userRoute.delete("/profile-Delete",authMiddlewares,userController.profileDelete);
userRoute.get("/profileDetails",authMiddlewares,userController.profileDetails);


userRoute.get("/recovery-verif-email/:email",userController.recoveryVerifyEmail);
userRoute.get("/recovery-verif-otp/:email/:otp",userController.recoveryVerifyOtp);
userRoute.post("/reset-password",userController.recoveryResetPassword);


// task routes

userRoute.post("/create-task",authMiddlewares,taskController.createTask);
userRoute.put("/update-task/:id",authMiddlewares,taskController.updateTask);
userRoute.delete("/delete-task/:id",authMiddlewares,taskController.deleteTask);
userRoute.get("/task-status/:status",authMiddlewares,taskController.listByStatusTask);
userRoute.get("/task-status-count",authMiddlewares,taskController.statusByCount);



module.exports = userRoute