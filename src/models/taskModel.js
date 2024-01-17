const mongoose = require("mongoose");
const {Schema,model} = mongoose;

const taskSchema = new Schema({
    title:{
        type:String
    },
    description : {
        type : String
    },
    status:{
        type:String
    },
    email : {
        type:String
    },
    isDelete : {
        type : String,
        default : false
    }
},{timestamps:true,versionKey:false})

const taskModel = model("tasks",taskSchema);


module.exports = taskModel