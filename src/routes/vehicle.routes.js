// import express from 'express';
// import {Vehicle} from '../models/Vehicle.js';

// const router = express.Router();

// // Register vehicle
// router.post('/register', async (req, res) => {
//   try {
//     const { userId, vehicleId, vehicleType } = req.body;
//     const vehicle = await Vehicle.create({ userId, vehicleId, vehicleType });
//     res.status(201).json(vehicle);
//   } catch (err) {
//     res.status(500).json({ error: 'Vehicle registration failed' });
//   }
// });

// // Get all vehicles
// router.get('/', async (req, res) => {
//   try {
//     const vehicles = await Vehicle.find();
//     res.json(vehicles);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch vehicles' });
//   }
// });

// export default router;
