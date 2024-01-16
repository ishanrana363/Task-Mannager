// Basic Lib Import
const express = require("express")
const app = new express()
const connectDB = require("./db")
// Security Middleware Lib Import

const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const hpp = require("hpp")
const cors = require("cors")
const morgan = require("morgan")

// Security Middleware Implement

app.use(helmet())
app.use(mongoSanitize())
app.use(hpp())
app.use(cors())
app.use(morgan("dev"))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

// Request Rate Limit

const limit = rateLimit({
    windowMs : 10*60*1000,
    max : 300
})
app.use(limit)







// Api Implement




connectDB().catch(err => console.log(err));



// Undefine Routes

app.use("*",(req,res)=>{
    res.status(404).json({
        status : "fail",
        data : "Routes Not Found"
    })
})


module.exports = app