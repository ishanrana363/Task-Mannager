const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const SendEmailUtility = require("../utility/emailHelper")
const saltRounds = 10;
const otpModel = require("../models/otpModel")
// registration 

exports.registration = async(req,res) =>{
    try {
        
        let email = await userModel.findOne({ email: req.body.email });
        // if(email) return res.status(400).send( " User email already exists " );
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
        let userEmail = req.headers["email"];
         // Corrected typo here        
        let filter = { email: userEmail};
        let reqBody = req.body;
        let update = reqBody;

        // Using the `findOneAndUpdate` method to update a single document
        let data = await userModel.findOneAndUpdate(filter, update, { new: true });
        if(data.isDelete) throw new Error()
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

exports.profileDelete = async (req,res) =>{
    try {
        let userEmail = req.headers["email"];
        let filter = { email : userEmail };
        let update = { isDelete : true };
        let result = await userModel.updateOne(filter,update);
        res.status(200).json({
            status : "success",
            data : result
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.toString(),
        });
    }
}


exports.profileDetails = async (req, res) => {
    try {
        let userEmail = req.headers["email"];
        let filter = {email:userEmail};
        if(!userEmail) return res.status(404).send( " Profile not found " )
        let result = await userModel.findOne(filter)
        if(result.isDelete) throw new Error();
        let data = result.toObject();
        delete data.isDelete
        res.status(200).json({
            status : "success",
            data : data
        })
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.toString(),
        });
    }
};


// const userModel = require('./userModel'); // Import your userModel
// const otpModel = require('./otpModel');   // Import your otpModel
// const SendEmailUtility = require('./SendEmailUtility'); // Import your email utility function

exports.recoveryVerifyEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const code = Math.floor(100000 + Math.random() * 900000);
        const emailText = `Your verification code is: ${code}`;
        const emailSub = "Your verification";
        let status = 0

        // Check if the email exists in userModel
        const user = await userModel.findOne({ email });

        if (user) {
            // Send email
            await SendEmailUtility(email, emailText, emailSub);

            // Find the existing OTP or create a new one
            const otp = await otpModel.findOneAndUpdate(
                { email },
                { $set: { otp: code,status:status    } },
                { upsert: true, new: true }
            );

            res.status(200).json({
                status: "success",
                message: "6-digit OTP has been sent",
                data: otp,
            });
        } else {
            res.status(404).json({
                status: "fail",
                message: "Email not found",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.toString(),
        });
    }
};






exports.recoveryVerifyOtp = async (req,res) =>{
    try {
        let email = req.params.email;
        let status = 0;
        let otpCode = req.params.otp;
        let statusUpdate = 1;
        let result = await otpModel.findOne({email:email,otp:otpCode,status:status}).count();
        if(result===1){
            await otpModel.updateOne({email:email,otp:otpCode,status:status},{status:statusUpdate});
            res.status(200).json({
                status:"success",
                message : " user verification successfully "
            })
        }else{
            res.status(401).json({
                status:"success",
                message : " otp not found "
            })
        }
    } catch (error) {
        res.status(401).json({
            status : "unauthorized",
            error : error.toString()
        })
    }
        
}

exports.recoveryResetPassword = async (req, res) => {
    try {
        const newPass = req.body.password;
        const email = req.body.email;
        const otpCode = req.body.otp;
        const statusUpdate = 1;

        // Check if the OTP is valid for the given email and status
        const result = await otpModel.findOneAndUpdate(
            { email, otp: otpCode,status: statusUpdate}, // Assuming status 0 means the OTP is not yet used
            { new: true }
        ).countDocuments();
        if (result === 1) {
            // OTP is valid, update the user's password
            const hashPassword = bcrypt.hashSync(newPass,saltRounds)
            await userModel.updateOne({ email }, { password: hashPassword });

            res.status(200).json({
                status: "success",
                data: "Password reset successful",
            });
        } else {
            // Invalid OTP or user not found
            res.status(401).json({
                status: "fail",
                data: "Unauthorized or Invalid OTP",
            });
        }
    } catch (error) {
        // Handle other errors
        console.error("Error:", error);
        res.status(500).json({
            status: "fail",
            error: error.toString(),
        });
    }
};