import mongoose from "mongoose"
const guestBookingSchema = new mongoose.Schema({
    emailOrPhone: { 
        type: String, 
        required: true 
    },
    vehicleId: { 
        type: String, 
        required: true 
    },
    vehicleType: { 
        type: String, 
        enum: ['2-wheeler', '4-wheeler'], 
        required: true 
    },
    bookedSlotId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Slot', 
        required: true 
    },
    role: { 
        type: String, 
        default: 'guest' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, {timestamps : true})

export const GuestBooking = mongoose.model('GuestBooking', guestBookingSchema)