import express from 'express';
import {AdminLog} from '../models/AdminLog.models.js';

const router = express.Router();

// Log admin activity
router.post('/log', async (req, res) => {
  try {
    const log = await AdminLog.create(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: 'Admin log failed' });
  }
});

// Get logs
router.get('/', async (req, res) => {
  try {
    const logs = await AdminLog.find();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

export default router;
