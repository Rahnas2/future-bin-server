import express from 'express';
import container from '../../infrastructure/config/container'
import { webhookController } from '../controllers/webhookController';
import { INTERFACE_TYPE } from '../../utils/appConst';
import { paymentController } from '../controllers/paymentController';
import { authMiddleware } from '../middleware/authMiddleware';

const PaymentController = container.get<paymentController>(INTERFACE_TYPE.paymentController)
const AuthMiddleware = container.get<authMiddleware>(INTERFACE_TYPE.authMiddleware)

const router = express.Router();

router.post('/refund', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector'), PaymentController.onRefund);

export default router;