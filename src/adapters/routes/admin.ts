import express from 'express'

import { INTERFACE_TYPE } from '../../utils/appConst'
import container from '../../infrastructure/config/container'

import { adminController } from '../controllers/adminController'
import { userManagmentController } from '../controllers/userManagmentCotroller'
import { authMiddleware } from '../middleware/authMiddleware'
import { subscriptionController } from '../controllers/subscriptionController'






const controller = container.get<adminController>(INTERFACE_TYPE.adminController)
const userManagment = container.get<userManagmentController>(INTERFACE_TYPE.userManagmentController)
const SubscriptionController = container.get<subscriptionController>(INTERFACE_TYPE.subscriptionController)
const AuthMiddleware = container.get<authMiddleware>(INTERFACE_TYPE.authMiddleware)

const router = express.Router()


router.post('/login', controller.onLogin)

router.get('/fetch-users', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('admin'), userManagment.onFetchUsers)
router.get('/user/view-detail', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('admin'), userManagment.onUserDetail)
router.patch('/user/status', userManagment.onToggleStatus)

router.get('/collectors', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('admin'), userManagment.onFetchCollectors)
router.get('/collector/view-detail', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('admin'), userManagment.onCollectorDetail)
router.patch('/collector/request/approve', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('admin'), userManagment.onAcceptRequest)
router.patch('/collector/request/reject', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('admin'), userManagment.onRejectRequest)


//subscription managment 
router.route('/subscription')
    .post(AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('admin'), SubscriptionController.onAddSubscription)
    .put(AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('admin'), SubscriptionController.onEditSubscription)
    .delete(AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('admin'), SubscriptionController.onDeleteSubscription)

export default router