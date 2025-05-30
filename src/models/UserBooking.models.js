import mongoose from "mongoose"
const userBookingSchema = new mongoose.Schema({
    email: { type: String, required: true },
    vehicleId: { type: String, required: true },
    vehicleType: { type: String, required: true },
    bookedSlotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
    bookedUntil: { type: Date },
}, { timestamps: true });

export const UserBooking = mongoose.model('UserBooking', userBookingSchema)