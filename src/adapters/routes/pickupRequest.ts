import express from 'express';
import container from '../../infrastructure/config/container'
import { INTERFACE_TYPE } from '../../utils/appConst';
import { pickupRequestController } from '../controllers/pickupRequestController';
import { authMiddleware } from '../middleware/authMiddleware';

const AuthMiddleware = container.get<authMiddleware>(INTERFACE_TYPE.authMiddleware)
const controller = container.get<pickupRequestController>(INTERFACE_TYPE.pickupRequestController)

const router = express.Router();

router.route('/')
.post(AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('resident'), controller.onCreatePickupRequest)    //create new pickup request 
.put(AuthMiddleware.validateJwt,  AuthMiddleware.restrictTo('resident', 'collector'), controller.onUpdatePickupRequest)  // update existing pickup request

router.get('/:id', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('resident', 'collector'), controller.ongetPickupRequestById)

router.get('/user/:status',AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('resident', 'collector'), controller.onUserPickupRequestHistoryByStatus)
router.put('/cancel',AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('resident', 'collector'), controller.onCacelRequest)

router.get('/collector/near',AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector'), controller.onGetNearPickupRequest)
router.patch('/collector/accept',AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector'),  controller.onAcceptRequest)



export default router