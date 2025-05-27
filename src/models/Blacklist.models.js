import mongoose from "mongoose"
const blacklistSchema = new mongoose.Schema({
    vehicleNumber: { 
        type: String, 
        required: true 
    },
    reason: { 
        type: String 
    },
    addedAt: { 
        type: Date, 
        default: Date.now 
    }
})

export const Blacklist = mongoose.model('Blacklist', blacklistSchema)