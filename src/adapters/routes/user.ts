import express from 'express'

import container from '../../infrastructure/config/container'
import { INTERFACE_TYPE } from '../../utils/appConst'

import { userController } from '../controllers/userController'
import { authMiddleware } from '../middleware/authMiddleware'
import upload from '../middleware/multer'
import { subscriptionController } from '../controllers/subscriptionController'
import { pickupRequestController } from '../controllers/pickupRequestController'
import { notificationController } from '../controllers/notificationController'
import { chatController } from '../controllers/chatController'
import { paymentController } from '../controllers/paymentController'
import { cloudinaryController } from '../controllers/cloudinaryController'

const AuthMiddleware = container.get<authMiddleware>(INTERFACE_TYPE.authMiddleware)
const controller = container.get<userController>(INTERFACE_TYPE.userController)
const SubscriptionController = container.get<subscriptionController>(INTERFACE_TYPE.subscriptionController)
const PickupRequestController = container.get<pickupRequestController>(INTERFACE_TYPE.pickupRequestController)
const NotificationController = container.get<notificationController>(INTERFACE_TYPE.notificationController)
const ChatController = container.get<chatController>(INTERFACE_TYPE.chatController)
const PaymentController = container.get<paymentController>(INTERFACE_TYPE.paymentController)
const CloudinaryController = container.get<cloudinaryController>(INTERFACE_TYPE.cloudinaryController)

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

router.get('/chat-list', AuthMiddleware.restrictTo('resident', 'collector'), ChatController.onGetChatList)

router.route('/chat/messages')
.post(AuthMiddleware.restrictTo('resident', 'collector'), ChatController.onSentMessage)
.get(AuthMiddleware.restrictTo('resident', 'collector'), ChatController.onGetMessageHistory)
router.get('/chat/message-between', AuthMiddleware.restrictTo('collector'), ChatController.onGetMessagesBetweenTwoUser)
router.post('/chat/delete-image', AuthMiddleware.restrictTo('resident', 'collector'), CloudinaryController.onDeleteImage)

router.put('/payment-status', AuthMiddleware.restrictTo('resident', 'admin'), PaymentController.onConfirmPayment)




export default router