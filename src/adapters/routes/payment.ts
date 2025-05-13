import express from 'express';
import container from '../../infrastructure/config/container'
import { webhookController } from '../controllers/webhookController';
import { INTERFACE_TYPE } from '../../utils/appConst';
import { paymentController } from '../controllers/paymentController';
import { authMiddleware } from '../middleware/authMiddleware';

const controller = container.get<paymentController>(INTERFACE_TYPE.paymentController)
const AuthMiddleware = container.get<authMiddleware>(INTERFACE_TYPE.authMiddleware)   

const router = express.Router();     

router.post('/refund', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector'), controller.onRefund);

router.get('/client-secret/:requestId', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('resident'), controller.onGetClientSecret)

export default router;     