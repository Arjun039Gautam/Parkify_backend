import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { GuestOTP } from '../models/GuestOTP.models.js';
import verifiedGuests from '../utils/verifiedGuests.js';

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
console.log('✅ Send otp route loaded');
// Send OTP
router.post('/send', async (req, res) => {
  console.log('✅ Send otp route loaded 2.0');
  console.error('>>> Debug Message');
  process.stdout.write('>>> Log message\n');


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
router.post('/verify', async (req, res) => {
  const { emailOrPhone, otp } = req.body;

  try {
    const record = await GuestOTP.findOne({ emailOrPhone, otp });

    if (!record) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    record.verified = true;
    await record.save();  // This must save the verified flag!

    // You can also add a console log here to confirm:
    console.log(`Verified OTP for ${emailOrPhone}`);

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error('OTP verification failed:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;
