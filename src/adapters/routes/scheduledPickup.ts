import express from 'express';
import container from '../../infrastructure/config/container'

import { INTERFACE_TYPE } from '../../utils/appConst'
import { authMiddleware } from '../middleware/authMiddleware';
import { scheduledPickupController } from '../controllers/scheduledPickupController';

const AuthMiddleware = container.get<authMiddleware>(INTERFACE_TYPE.authMiddleware)
const controller = container.get<scheduledPickupController>(INTERFACE_TYPE.scheduledPickupController)

const router = express.Router();

router.get('/collector', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector'), controller.onGetCollectorScheduledPickups)

router.put('/:id/complete', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector'), controller.onCompleteScheduledPickup)

router.get('/:pickupRequestId', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector', 'resident'), controller.onGetScheduledPickupsForTheRequest)

export default router