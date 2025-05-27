import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        min : [6, 'Must be at least 6, got {VALUE}'],
        max : 12
    },
    role : {
        type : String,
        enum : ['admin', 'user'], default: 'user' 
    },
    vehicleInfo: {
        number: String,
        type: String
    }
}, {timestamps : true})

export const User = mongoose.model('User', userSchema)