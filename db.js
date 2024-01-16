const  mongoose = require("mongoose");
require("dotenv").config();
const dbPort = process.env.DB_URL


async function connectDB() {
    await mongoose.connect(dbPort);
    console.log(`--Database connected--`)
}

module.exports = connectDB