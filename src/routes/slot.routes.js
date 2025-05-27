import express from 'express';
import { Slot } from '../models/Slot.models.js';
import { User } from '../models/User.models.js';
import { GuestBooking } from '../models/GuestBooking.models.js';
import { GuestOTP } from '../models/GuestOTP.models.js';

const router = express.Router();

// GET all slots
router.get('/', async (req, res) => {
  try {
    const slots = await Slot.find();
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

// POST add slot (admin)
router.post('/add', async (req, res) => {
  try {
    const slot = await Slot.create(req.body);
    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add slot' });
  }
});


// ✅ Book slot for registered user
router.post('/book/user', async (req, res) => {
  const { vehicleType, email, bookedUntil } = req.body;

  if (!vehicleType || !email) {
    return res.status(400).json({ error: 'vehicleType and email are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const slot = await Slot.findOneAndUpdate(
      { vehicleType, status: 'available' },
      {
        status: 'booked',
        bookedBy: user._id,
        bookedByModel: 'User',
        bookedUntil: bookedUntil ? new Date(bookedUntil) : null
      },
      { new: true }
    );

    if (!slot) return res.status(404).json({ error: 'No available slots for this vehicle type' });

    res.json({ message: 'Slot booked for user', slot });
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
    // ✅ (Optional) Check if guest is verified (from OTP table)
    const verified = await GuestOTP.findOne({ emailOrPhone });
    if (!verified) {
      return res.status(403).json({ error: 'Guest not verified by OTP' });
    }

    // ✅ Find and book slot
    const slot = await Slot.findOneAndUpdate(
      { vehicleType, status: 'available' },
      {
        status: 'booked',
        bookedUntil: bookedUntil ? new Date(bookedUntil) : null
      },
      { new: true }
    );

    if (!slot) {
      return res.status(404).json({ error: 'No available slots for this vehicle type' });
    }

    // ✅ Create guest booking
    const guestBooking = await GuestBooking.create({
      emailOrPhone,
      vehicleId,
      vehicleType,
      bookedSlotId: slot._id
    });

    // ✅ Update slot with reference to guest
    slot.bookedBy = guestBooking._id;
    slot.bookedByModel = 'GuestBooking';
    await slot.save();

    res.status(201).json({ message: 'Slot booked successfully for guest', slot, guestBooking });
  } catch (error) {
    res.status(500).json({ error: 'Booking failed', details: error.message });
  }
});

export default router;
