import express from 'express'

import { INTERFACE_TYPE } from '../../utils/appConst'
import container from '../../infrastructure/config/container'

import { adminController } from '../controllers/adminController'
import { userManagmentController } from '../controllers/userManagmentCotroller'
import { authMiddleware } from '../middleware/authMiddleware'
import { subscriptionController } from '../controllers/subscriptionController'






const controller = container.get<adminController>(INTERFACE_TYPE.adminController )
const userManagment = container.get<userManagmentController>(INTERFACE_TYPE.userManagmentController)
const SubscriptionController = container.get<subscriptionController>(INTERFACE_TYPE.subscriptionController)
const AuthMiddleware = container.get<authMiddleware>(INTERFACE_TYPE.authMiddleware)

const router = express.Router()


router.post('/login',controller.onLogin)

router.get('/fetch-users', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('admin'),  userManagment.onFetchUsers)
router.get('/user/view-detail', AuthMiddleware.validateJwt, userManagment.onUserDetail)
router.patch('/user/status', AuthMiddleware.validateJwt, userManagment.onToggleStatus)

router.get('/collectors', AuthMiddleware.validateJwt, userManagment.onFetchCollectors)
router.get('/collector/view-detail', AuthMiddleware.validateJwt, userManagment.onCollectorDetail)
router.patch('/collector/request/approve', AuthMiddleware.validateJwt, userManagment.onAcceptRequest)
router.patch('/collector/request/reject', AuthMiddleware.validateJwt, userManagment.onRejectRequest)


//subscription managment 
router.post('/subscription/add', AuthMiddleware.validateJwt, SubscriptionController.onAddSubscription)
router.put('/subscription/edit', AuthMiddleware.validateJwt, SubscriptionController.onEditSubscription)
router.delete('/subscription/delete', AuthMiddleware.validateJwt, SubscriptionController.onDeleteSubscription)



export default router