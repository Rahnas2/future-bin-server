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


import authRouter from './adapters/routes/auth';
import userRouter from './adapters/routes/user'
import adminRouter from './adapters/routes/admin'
import collectorRouter from './adapters/routes/collector'

import { errorHandler } from './adapters/middleware/errorHandler';

import { INTERFACE_TYPE } from './utils/appConst';


const PORT = process.env.PORT || 7070

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use(authRouter)
app.use(userRouter)
app.use('/collector', collectorRouter)
app.use('/admin', adminRouter)

//error handling middleware 
app.use(errorHandler)


connectDB().then(() => {
    server.listen(PORT, () => {
        console.log('listening to : ', PORT)
    })
})

