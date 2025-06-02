import cron from 'node-cron';
import { Slot } from '../models/Slot.models.js';

export const freeExpiredSlotsJob = cron.schedule('*/5 * * * *', async () => {
  try {
    const now = new Date();

    const result = await Slot.updateMany(
      { bookedUntil: { $lte: now }, status: 'booked' },
      {
        status: 'available',
        bookedBy: null,
        bookedByModel: null,
        vehicleId: null,
        bookedUntil: null
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`[CRON] Freed ${result.modifiedCount} expired slots at ${now.toLocaleString()}`);
    }
  } catch (error) {
    console.error('[CRON] Error freeing expired slots:', error.message);
  }
});
