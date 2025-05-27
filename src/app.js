import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

import userRoutes from './routes/user.routes.js';
// import vehicleRoutes from './routes/vehicle.routes.js';
import slotRoutes from './routes/slot.routes.js';
import adminLogRoutes from './routes/adminLog.routes.js';
import guestOtpRoutes from './routes/guest.routes.js';
import guestBookingRoutes from './routes/guestBooking.routes.js';

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
// app.use('/api/vehicles', vehicleRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/admin/logs', adminLogRoutes);
app.use('/api/guest/otp', guestOtpRoutes);
app.use('/api/guest/booking', guestBookingRoutes);


export { app }
