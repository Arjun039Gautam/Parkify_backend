import express from 'express';
import { UserBooking } from '../models/UserBooking.models.js';
import { GuestBooking } from '../models/GuestBooking.models.js';
import {User} from '../models/User.models.js';

const router = express.Router();

// ✅ Route to get all bookings (admin panel)
router.get('/all', async (req, res) => {
  try {
    const userBookings = await UserBooking.find().populate('bookedSlotId');
    const guestBookings = await GuestBooking.find().populate('bookedSlotId');

    // Get user names
    const users = await User.find({}, 'email name');
    const emailToNameMap = {};
    users.forEach(user => {
      emailToNameMap[user.email] = user.name;
    });

    const combined = [];

    userBookings.forEach(booking => {
      if (!booking.bookedSlotId) return;
      combined.push({
        name: emailToNameMap[booking.email] || 'User',
        email: booking.email,
        vehicleId: booking.vehicleId,
        vehicleType: booking.vehicleType,
        booking_dateTime: booking.createdAt,
        expire_dateTime: booking.bookedUntil,
        slotNumber: booking.bookedSlotId.slotNumber
      });
    });

    guestBookings.forEach(booking => {
      if (!booking.bookedSlotId) return;
      combined.push({
        name: 'Guest',
        email: booking.emailOrPhone,
        vehicleId: booking.vehicleId,
        vehicleType: booking.vehicleType,
        booking_dateTime: booking.createdAt,
        expire_dateTime: booking.bookedUntil,
        slotNumber: booking.bookedSlotId.slotNumber
      });
    });

    res.status(200).json({ bookings: combined });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all bookings', details: error.message });
  }
});

// ✅ Route to get all bookings for a specific user (user panel)
router.get('/user/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const bookings = await UserBooking.find({ email }).populate('bookedSlotId');
    if (!bookings.length) {
      return res.status(404).json({ message: 'No bookings found for this user' });
    }

    const formatted = bookings.map(booking => ({
      vehicleId: booking.vehicleId,
      vehicleType: booking.vehicleType,
      dateTime: booking.createdAt,
      slotNumber: booking.bookedSlotId?.slotNumber || 'N/A'
    }));

    res.status(200).json({ bookings: formatted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user bookings', details: error.message });
  }
});

export default router;
