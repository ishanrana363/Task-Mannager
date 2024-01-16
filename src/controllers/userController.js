const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcrypt");
const saltRounds = 10;

// registration 


exports.registration = async(req,res) =>{
    try {
        let email = await userModel.findOne({ email: req.body.email });
        if(email) return res.status(400).send( " User email already exists " )
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

exports.login = async (req,res) =>{
    try {
        let userEmail = req.body.email;
        let filter = { email : userEmail };
        let result = await userModel.findOne(filter);
        if(!result) return res.status(400).send("user not found");
        if( !bcrypt.compareSync(req.body.password,result.password)){
            return res.status(401).json({
                status : "fail",
                message : "Incorrect Password "
            })
        };
        const secretKey = process.env.JWT_KEY
        const payload = {
            id : result._id,
            email : result.email,
            exp : Math.floor(Date.now()/1000 + 24*60*60)
        };
        const token = jwt.sign(payload, secretKey);
        return(
            res.status(201).json({
                status:"success",
                data : token
            })
        )
    } catch (error) {
        res.status(500).json({
            status:"fail",
            message : error.toString()
        })
    }
}