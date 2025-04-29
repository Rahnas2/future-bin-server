import express from 'express'
import container from '../../infrastructure/config/container'
import { notificationController } from '../controllers/notificationController'
import { INTERFACE_TYPE } from '../../utils/appConst'
import { authMiddleware } from '../middleware/authMiddleware'

const AuthMiddleware = container.get<authMiddleware>(INTERFACE_TYPE.authMiddleware)
const controller = container.get<notificationController>(INTERFACE_TYPE.notificationController)

const router = express.Router()

router.route('/')
.get(AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('resident', 'collector'), controller.onFetchAllNotificationOfReceiver)
.delete(AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('resident', 'collector'), controller.onDeleteNotifiation)

export default router