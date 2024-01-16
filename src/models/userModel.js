const mongoose = require("mongoose");

const { Schema,model } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        validate: {
            validator: function(v) {
            return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(v);
        },
            message: props => `${props.value} is not a valid email  !`
        },
        required: [true, 'User email required'],
    },
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    password : {
        type : String,
        trim : true
    }
},{timestamps:true,versionKey:false});

userSchema.index({ email: 1 }, { unique: true });
const userModel = model("users",userSchema);

module.exports = userModel;