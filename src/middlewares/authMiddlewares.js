const jwt = require("jsonwebtoken");
require("dotenv").config()
const secretKey = process.env.JWT_KEY

module.exports=(req,res,next)=>{
    let token = req.headers["token"];
    if(!token){
        token = req.cookies["token"]
    };
        jwt.verify(token,secretKey,(error,decode)=>{
            if(error){
                res.status(401).json({
                    status : "Unauthorized"
                })
            }else{
                
                let email = decode["email"];
                let id = decode["id"];
                req.headers.email = email;
                req.headers.id = id
                next()
            }
    });
};