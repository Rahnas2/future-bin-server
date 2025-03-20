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

router.use(AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('admin'))

router.get('/fetch-users', userManagment.onFetchUsers)
router.get('/user/view-detail', userManagment.onUserDetail)
router.patch('/user/status', userManagment.onToggleStatus)

router.get('/collectors', userManagment.onFetchCollectors)
router.get('/collector/view-detail', userManagment.onCollectorDetail)
router.patch('/collector/request/approve', userManagment.onAcceptRequest)
router.patch('/collector/request/reject', userManagment.onRejectRequest)


//subscription managment 
router.route('/subscription')
    .post(SubscriptionController.onAddSubscription)
    .put(SubscriptionController.onEditSubscription)
    .delete(SubscriptionController.onDeleteSubscription)

export default router