const userModel = require("../models/userModel");
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
                password : hash
            });
            await newUser.save()
            .then((user)=>{
                res.send({
                    status:"success",
                    message:"user create",
                    user : {
                        id : user._id,
                        email : user.email,
                        firstName : user.firstName,
                        lastName : user.lastName    
                    }
                })
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