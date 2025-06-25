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
      from: `"Parkify 🚗" <${process.env.EMAIL_USER}>`,
      to: emailOrPhone,
      subject: 'Parkify Guest OTP - Secure Access Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; background-color: #f4f4f4; border-radius: 8px; border: 1px solid #ccc;">
          <h2 style="color: #2c3e50;">Welcome to <span style="color: #007BFF;">Parkify (Guest)</span>!</h2>
          <p>To access our services as a guest, please use the following One-Time Password (OTP):</p>
          <div style="font-size: 30px; font-weight: bold; color: #007BFF; margin: 20px 0;">${otp}</div>
          <p>This OTP is valid for the next <strong>10 minutes</strong>. Please do not share this code with anyone.</p>
          <p>If you did not request this, you can safely ignore this email.</p>
          <hr style="margin: 20px 0;" />
          <p style="font-size: 14px; color: #555;">Regards,<br/>The Parkify Team</p>  
        </div>
      `
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
