import mongoose from "mongoose"
const bookingSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    slotId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Slot', 
        required: true 
    },
    vehicleNumber: { 
        type: String, 
        required: true 
    },
    bookingType: { 
        type: String, 
        enum: ['daily', 'monthly', 'yearly'], 
        required: true 
    },
    startTime: { 
        type: Date, 
        required: true 
    },
    endTime: { 
        type: Date, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['active', 'cancelled'], 
        default: 'active' 
    }
}, {timestamps : true})

export const Booking = mongoose.model('Booking', bookingSchema)