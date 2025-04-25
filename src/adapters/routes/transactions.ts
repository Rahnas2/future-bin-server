import express from "express";
import container from '../../infrastructure/config/container'

import { INTERFACE_TYPE } from '../../utils/appConst'
import { authMiddleware } from '../middleware/authMiddleware';
import { transactionController } from "../controllers/transactionController";

const AuthMiddleware = container.get<authMiddleware>(INTERFACE_TYPE.authMiddleware)
const controller = container.get<transactionController>(INTERFACE_TYPE.transactionController)

const router = express.Router()

router.route('/')
.get(AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('resident', 'collector', 'admin'),controller.onTransactionHistory)

router.get('/analytics', controller.onAnalytics)

export default router