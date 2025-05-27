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
    status: { 
        type: String, 
        enum: ['available', 'booked'], 
        default: 'available' 
    },
    bookedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        refPath: 'bookedByModel' 
    },
    bookedByModel: { 
        type: String, 
        enum: ['User', 'GuestBooking'] 
    },
    bookedUntil: { 
        type: Date
    }
}, {timestamps : true})

export const Slot = mongoose.model('Slot', slotSchema)