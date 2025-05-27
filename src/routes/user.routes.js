import express from 'express';
import { User } from '../models/User.models.js';

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, vehicleInfo } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ error: 'User already exists, please login' });
    }

    user = await User.create({ name, email, password, role, vehicleInfo });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error('Register route error:', err);
    res.status(500).json({ error: 'User registration failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found, please register' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    res.status(200).json({ message: 'User logged in successfully', user });
  } catch (err) {
    console.error('Login route error:', err);
    res.status(500).json({ error: 'User login failed' });
  }
});

export default router;
