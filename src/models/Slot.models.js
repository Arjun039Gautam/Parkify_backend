import mongoose from "mongoose"
const slotSchema = new mongoose.Schema({
    slotNumber: { 
        type: Number, 
        required: true, 
        unique: true 
    },
    vehicleType: { 
        type: String, 
        enum: ['2-wheeler', '4-wheeler'], 
        required: true 
    }, 
    vehicleId: {
        type: String,
        default: null
    },
    status: { 
        type: String, 
        enum: ['available', 'booked'], 
        default: 'available' 
    },
    bookedBy: {
        type: String,
        default: null
    },
    bookedByModel: {
        type: String,
        enum: ['User', 'GuestBooking'], // ✅ Fix: allow 'GuestBooking'
        default: null
    },
    bookedUntil: { 
        type: Date
    }
}, {timestamps : true})

export const Slot = mongoose.model('Slot', slotSchema)