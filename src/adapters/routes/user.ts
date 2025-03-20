import express from 'express'

import container from '../../infrastructure/config/container'
import { INTERFACE_TYPE } from '../../utils/appConst'

import { userController } from '../controllers/userController'
import { authMiddleware } from '../middleware/authMiddleware'
import upload from '../middleware/multer'
import { subscriptionController } from '../controllers/subscriptionController'
import { pickupRequestController } from '../controllers/pickupRequestController'

const AuthMiddleware = container.get<authMiddleware>(INTERFACE_TYPE.authMiddleware)
const controller = container.get<userController>(INTERFACE_TYPE.userController)
const SubscriptionController = container.get<subscriptionController>(INTERFACE_TYPE.subscriptionController)
const PickupRequestController = container.get<pickupRequestController>(INTERFACE_TYPE.pickupRequestController)

const router = express.Router()

router.use(AuthMiddleware.validateJwt)

router.route('/profile')
.get(AuthMiddleware.restrictTo('resident'), controller.onFetchUser)
.put(AuthMiddleware.restrictTo('resident', 'collector'), upload.single('profileImage'), controller.onEditUserProfile)

router.post('/change-password',AuthMiddleware.restrictTo('resident', 'collector'), controller.onChangePassword)

router.get('/subscriptions', AuthMiddleware.restrictTo('resident', 'admin'), SubscriptionController.OnfetchSubscriptons)

router.post('/pickup-request', AuthMiddleware.restrictTo('resident'), PickupRequestController.onCreatePickupRequest)

router.get('/pickup-request/history', AuthMiddleware.restrictTo('resident', 'collector'), PickupRequestController.onUserPickupRequestHistory)

export default router