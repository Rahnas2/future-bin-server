import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { INTERFACE_TYPE } from '../../utils/appConst'
import container from '../../infrastructure/config/container'
import { overviewController } from '../controllers/overviewController'


const AuthMiddleware = container.get<authMiddleware>(INTERFACE_TYPE.authMiddleware)
const controller = container.get<overviewController>(INTERFACE_TYPE.overviewController)

const router = express.Router()


// Unread Notification and Chat counts
router.get('/counts', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('resident', 'collector'),  controller.onGetUnreadCounts)

export default router
