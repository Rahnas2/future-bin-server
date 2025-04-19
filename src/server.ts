import 'reflect-metadata'
import express from "express";
import { createServer } from 'node:http';

import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import connectDB from "./infrastructure/config/mongodb";
import cors from 'cors'


import container from './infrastructure/config/container';


const app = express();
const server = createServer(app);
import { SocketConfig } from './infrastructure/config/socket';
// Get SocketConfig from container & initialize
const socketConfig = container.get(SocketConfig);
socketConfig.initializeSocket(server);


//routes
import webhookRouter from './adapters/routes/webhook'

import authRouter from './adapters/routes/auth';
import userRouter from './adapters/routes/user'
import adminRouter from './adapters/routes/admin'
import collectorRouter from './adapters/routes/collector'
import pickupRequestRouter from './adapters/routes/pickupRequest'
import paymentRouter from './adapters/routes/payment'
import reviewRouter from './adapters/routes/review'
import scheduledPickupRouter from './adapters/routes/scheduledPickup'

import { errorHandler } from './adapters/middleware/errorHandler';



const PORT = process.env.PORT || 7070

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use('/api/webhook', webhookRouter)

app.use(express.json())
app.use(cookieParser())

app.use(authRouter)
app.use('/admin', adminRouter)

app.use(userRouter)

app.use('/api/collector', collectorRouter)
app.use('/api/pickup-requests', pickupRequestRouter)
app.use('/api', paymentRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/scheduled-pickups', scheduledPickupRouter)


//error handling middleware 
app.use(errorHandler)


connectDB().then(() => {
    server.listen(PORT, () => {
        console.log('listening to : ', PORT)
    })
})

