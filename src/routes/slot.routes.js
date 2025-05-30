import express from 'express';
import { Slot } from '../models/Slot.models.js';
import { User } from '../models/User.models.js';
import { GuestBooking } from '../models/GuestBooking.models.js';
import { GuestOTP } from '../models/GuestOTP.models.js';
import { UserBooking } from '../models/UserBooking.models.js';

const router = express.Router();

// GET all slots
router.get('/', async (req, res) => {
  try {
    const slots = await Slot.find();

    const formatted = slots.map(slot => ({
      slotId: slot._id,
      slotNumber: slot.slotNumber,
      status: slot.status,
      bookedBy: slot.bookedBy || null
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});


// Book slot for registered user
router.post('/book/user', async (req, res) => {
  const { vehicleType, email, vehicleId, bookedUntil } = req.body;

  if (!vehicleType || !email || !vehicleId) {
    return res.status(400).json({ error: 'vehicleType, email, and vehicleId are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const slot = await Slot.findOneAndUpdate(
      { vehicleType, status: 'available' },
      {
        status: 'booked',
        bookedBy: email,
        bookedByModel: 'User',
        vehicleId: vehicleId,
        bookedUntil: bookedUntil ? new Date(bookedUntil) : null
      },
      { new: true }
    );

    if (!slot) return res.status(404).json({ error: 'No available slots for this vehicle type' });

    const userBooking = await UserBooking.create({
      email,
      vehicleId,
      vehicleType,
      bookedSlotId: slot._id,
      bookedUntil: slot.bookedUntil
    });

    res.status(201).json({
      message: 'Slot booked successfully for user',
      slotNumber: slot.slotNumber
    });

  } catch (error) {
    res.status(500).json({ error: 'Booking failed for user', details: error.message });
  }
});

router.post('/book/guest', async (req, res) => {
  const { emailOrPhone, vehicleType, vehicleId, bookedUntil } = req.body;

  if (!emailOrPhone || !vehicleType || !vehicleId) {
    return res.status(400).json({ error: 'Missing required fields: emailOrPhone, vehicleType, or vehicleId' });
  }

  try {
    const verifiedEntry = await GuestOTP.findOne({ emailOrPhone, verified: true });
    if (!verifiedEntry) {
      return res.status(403).json({ error: 'Guest not verified by OTP' });
    }

    const slot = await Slot.findOneAndUpdate(
      { vehicleType, status: 'available' },
      {
        status: 'booked',
        bookedUntil: bookedUntil ? new Date(bookedUntil) : null,
        vehicleId: vehicleId,
        bookedBy: emailOrPhone
      },
      { new: true }
    );

    if (!slot) {
      return res.status(404).json({ error: 'No available slots for this vehicle type' });
    }

    const guestBooking = await GuestBooking.create({
      emailOrPhone,
      vehicleId,
      vehicleType,
      bookedSlotId: slot._id
    });

    await GuestOTP.deleteMany({ emailOrPhone });

    res.status(201).json({
      message: 'Slot booked successfully for guest',
      slotNumber: slot.slotNumber
    });

  } catch (error) {
    res.status(500).json({ error: 'Booking failed', details: error.message });
  }
});


export default router;
