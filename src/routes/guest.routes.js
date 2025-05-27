import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { GuestOTP } from '../models/GuestOTP.models.js';

dotenv.config();
const router = express.Router();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send OTP
router.post('/send', async (req, res) => {
  const { emailOrPhone } = req.body;

  if (!emailOrPhone) {
    return res.status(400).json({ error: 'Email or phone is required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Save OTP in DB
    await GuestOTP.create({ emailOrPhone, otp });

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emailOrPhone,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`
    });

    res.status(200).json({ message: 'OTP sent successfully to email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP
// Option 1: Add verified email to a temporary Set (in-memory - good for testing)
const verifiedEmails = new Set(); // Move to top of file if you want to persist during runtime

router.post('/verify', async (req, res) => {
  const { emailOrPhone, otp } = req.body;

  try {
    const found = await GuestOTP.findOne({ emailOrPhone, otp });
    if (!found) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Delete OTP after successful verification
    await GuestOTP.deleteOne({ _id: found._id });

    // Add to verified guest list
    verifiedEmails.add(emailOrPhone);

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ error: 'OTP verification failed' });
  }
});



export default router;
