import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

import userRoutes from './routes/user.routes.js';
import slotRoutes from './routes/slot.routes.js';
import guestOtpRoutes from './routes/guest.routes.js';
import guestRoutes from './routes/guest.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import { freeExpiredSlotsJob } from './cron/freeExpiredSlots.js';

const app = express()
const allowedOrigins = ['http://localhost:3000', 'https://parkify-frontend-eta.vercel.app'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}));

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/guest/otp', guestOtpRoutes);
app.use('/guest', guestRoutes);
app.use('/api/bookings', bookingRoutes);

freeExpiredSlotsJob.start(); // start the cron job


export { app }
