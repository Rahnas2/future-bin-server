import express from 'express'

import container from '../../infrastructure/config/container'
import { INTERFACE_TYPE } from '../../utils/appConst'

import { userController } from '../controllers/userController'
import { authMiddleware } from '../middleware/authMiddleware'
import upload from '../middleware/multer'
import { subscriptionController } from '../controllers/subscriptionController'
import { pickupRequestController } from '../controllers/pickupRequestController'
import { notificationController } from '../controllers/notificationController'

const AuthMiddleware = container.get<authMiddleware>(INTERFACE_TYPE.authMiddleware)
const controller = container.get<userController>(INTERFACE_TYPE.userController)
const SubscriptionController = container.get<subscriptionController>(INTERFACE_TYPE.subscriptionController)
const PickupRequestController = container.get<pickupRequestController>(INTERFACE_TYPE.pickupRequestController)
const NotificationController = container.get<notificationController>(INTERFACE_TYPE.notificationController)

const router = express.Router()

router.use(AuthMiddleware.validateJwt)

router.route('/profile')
.get(AuthMiddleware.restrictTo('resident'), controller.onFetchUser)
.put(AuthMiddleware.restrictTo('resident', 'collector'), upload.single('profileImage'), controller.onEditUserProfile)

router.post('/change-password',AuthMiddleware.restrictTo('resident', 'collector'), controller.onChangePassword)

router.get('/subscriptions', AuthMiddleware.restrictTo('resident', 'admin'), SubscriptionController.OnfetchSubscriptons)

router.get('/subscriptions/:id', AuthMiddleware.restrictTo('resident'), SubscriptionController.onFetchSubscriptonById)

router.post('/pickup-request', AuthMiddleware.restrictTo('resident'), PickupRequestController.onCreatePickupRequest)

router.get('/pickup-request/history', AuthMiddleware.restrictTo('resident', 'collector'), PickupRequestController.onUserPickupRequestHistory)

router.route('/notications')
.get(AuthMiddleware.restrictTo('resident'), NotificationController.onFetchAllNotificationOfUser)
.delete(AuthMiddleware.restrictTo('resident'), NotificationController.onDeleteNotifiation)


export default router