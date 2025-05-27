import express from 'express';
import {GuestBooking} from '../models/GuestBooking.models.js';

const router = express.Router();

// Book a slot
router.post('/book', async (req, res) => {
  try {
    const booking = await GuestBooking.create(req.body);
    res.status(201).json({ message: 'Guest booked', booking });
  } catch (err) {
    res.status(500).json({ error: 'Booking failed' });
  }
});

// View all guest bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await GuestBooking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch guest bookings' });
  }
});

export default router;
