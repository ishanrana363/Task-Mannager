const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcrypt");
const { default: mongoose, mongo } = require("mongoose");
const saltRounds = 10;

// registration 


exports.registration = async(req,res) =>{
    try {
        let email = await userModel.findOne({ email: req.body.email });
        if(email) return res.status(400).send( " User email already exists " );
        bcrypt.hash(req.body.password, saltRounds, async(err, hash)=> {
            let newUser = new userModel({
                email : req.body.email,
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                isDelete : false,
                password : hash
            });
            await newUser.save()
            .then((user)=>{
                res.status(201).json({
                    status:"success",
                    message:"user create",
                    user : {
                        id : user._id,
                        email : user.email,
                        firstName : user.firstName,
                        lastName : user.lastName,   
                    }
                });
            }).catch((error)=>{
                res.status(500).json({
                    status:"fail",
                    message : error.toString()
                })
            })
        });
    } catch (error) {
        res.status(500).json({
            status:"fail",
            message : error.toString()
        })
    }
}


// login

exports.login = async (req, res) => {
    try {
        let userEmail = req.body.email;
        let filter = { email: userEmail };
        let result = await userModel.findOne(filter);

        if (!result) {
            return res.status(404).send("User not found");
        }

        if (!bcrypt.compareSync(req.body.password, result.password)) {
            return res.status(401).json({
                status: "fail",
                message: "Incorrect Password",
            });
        }

        const secretKey = process.env.JWT_KEY;
        const payload = {
            id: result._id,
            email : result.email,
            exp: Math.floor(Date.now() / 1000 + 24 * 60 * 60),
        };

        const token = jwt.sign(payload, secretKey);

        let cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.cookie("token", token, cookieOptions);

        res.status(201).json({
            status: "success",
            data: token,
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.toString(),
        });
    }
};

// logout

exports.logout = async (req, res) => {
    try {
        let cookieOptions = {
            expires: new Date(Date.now() - 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        // Clear the token cookie
        res.clearCookie("token", cookieOptions);

        res.status(200).json({
            status: "success",
            message: "User logout successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.toString(),
        });
    }
};


// profile update

exports.profileUpdate = async (req, res) => {
    try {
        let userEmail = req.headers["email"]; // Corrected typo here        
        let filter = { email: userEmail };
        let reqBody = req.body;
        let update = reqBody;

        // Using the `findOneAndUpdate` method to update a single document
        let data = await userModel.findOneAndUpdate(filter, update, { new: true });
        let userRes = data.toObject();
        delete userRes.isDelete;

        res.status(200).json({
            status: "success",
            data: userRes
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.toString(),
        });
    }
};


exports.profileDetails = async (req, res) => {
    try {
        let userID = new mongoose.Types.ObjectId(req.headers.id)
        let filter = { _id: userID };
        let result = await userModel.findOne(filter);
        const data = result.toObject();
        delete data.isDelete;
        res.status(200).json({
            status: "success",
            data: data
        });

    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.toString(),
        });
    }
};
