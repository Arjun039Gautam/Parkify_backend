import mongoose from "mongoose"
const guestOTPSchema = new mongoose.Schema({
    emailOrPhone: { 
        type: String, 
        required: true 
    },
    otp: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 300   // expires after 5 minutes
    } 
})

export const GuestOTP = mongoose.model('GuestOTP', guestOTPSchema)