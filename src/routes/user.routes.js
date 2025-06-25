  import express from 'express';
  import { User } from '../models/User.models.js';
  import nodemailer from 'nodemailer';
  import crypto from 'crypto';

  const router = express.Router();

  // In-memory store for pending users (replace with Redis/Mongo in prod)
  const pendingUsers = new Map();

  // Nodemailer transporter setup
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });


  // ✅ 1. Send OTP
  router.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: 'Email is required' });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists, please login' });
    }

    const code = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP

    pendingUsers.set(email, {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 min expiry
    });

    try {
      await transporter.sendMail({
        from: `"Parkify 🚗" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Parkify Account - OTP Inside',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
            <h2 style="color: #2b2b2b;">Welcome to <span style="color: #007BFF;">Parkify</span>!</h2>
            <p>Thank you for signing up. To complete your registration, please verify your email address using the One-Time Password (OTP) below:</p>
            <div style="font-size: 32px; font-weight: bold; margin: 20px 0; color: #007BFF;">${code}</div>
            <p>This OTP is valid for the next <strong>10 minutes</strong>.</p>
            <p>If you did not request this email, please ignore it.</p>
            <hr style="margin: 20px 0;" />
            <p style="font-size: 14px; color: #555;">Regards,<br/>The Parkify Team</p>
          </div>
        `
      });

      res.status(200).json({ message: 'OTP sent successfully to email' });
    } catch (err) {
      console.error('Error sending email:', err);
      res.status(500).json({ error: 'Failed to send OTP email' });
    }
  });


  // ✅ 2. Verify OTP + Register
  router.post('/verify-register', async (req, res) => {
    const { name, email, password, role, vehicleInfo, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ error: 'All fields including OTP are required' });
    }

    const pending = pendingUsers.get(email);
    if (!pending) {
      return res.status(400).json({ error: 'No OTP requested for this email' });
    }

    if (pending.code !== otp) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    if (Date.now() > pending.expiresAt) {
      pendingUsers.delete(email);
      return res.status(410).json({ error: 'OTP expired' });
    }

    try {
      const user = await User.create({
        name,
        email,
        password,
        role,
      });

      pendingUsers.delete(email); // remove OTP after success
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
      console.error('Registration failed:', err);
      res.status(500).json({ error: 'User registration failed' });
    }
  });


  // 🔐 Login route remains the same
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      res.status(200).json({ message: 'User logged in successfully', user });
    } catch (err) {
      console.error('Login route error:', err);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  export default router;
