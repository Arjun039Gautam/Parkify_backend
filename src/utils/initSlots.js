import { Slot } from '../models/Slot.models.js';

export async function initializeSlots() {
  const totalSlots = await Slot.countDocuments();

  if (totalSlots === 0) {
    const twoWheelerSlots = Array.from({ length: 50 }, (_, i) => ({
      slotNumber: i + 1,
      vehicleType: '2-wheeler',
      status: 'available',
    }));

    const fourWheelerSlots = Array.from({ length: 30 }, (_, i) => ({
      slotNumber: i + 51,
      vehicleType: '4-wheeler',
      status: 'available',
    }));

    await Slot.insertMany([...twoWheelerSlots, ...fourWheelerSlots]);
    console.log('Initialized slots: 50 two-wheeler and 30 four-wheeler');
  } else {
    console.log('Slots already initialized');
  }
}
