import express from 'express'

import container from '../../infrastructure/config/container'
import { INTERFACE_TYPE } from '../../utils/appConst'
import { authMiddleware } from '../middleware/authMiddleware'
import { collectorController } from '../controllers/collectorController'
import { pickupRequestController } from '../controllers/pickupRequestController'




const AuthMiddleware = container.get<authMiddleware>(INTERFACE_TYPE.authMiddleware)
const controller = container.get<collectorController>(INTERFACE_TYPE.collectorController)
const PickupRequestController = container.get<pickupRequestController>(INTERFACE_TYPE.pickupRequestController)

const router = express.Router()

router.get('/profile', AuthMiddleware.validateJwt, controller.onFetchCollector)

router.get('/pickup-requests', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector'), PickupRequestController.onGetNearPickupRequest)
router.get('/pickup-request/:id', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector'), PickupRequestController.ongetPickupRequestById)
router.patch('/pickup-request/accept', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector'), PickupRequestController.onAcceptRequest)



export default router