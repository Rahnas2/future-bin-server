import express from 'express'

import container from '../../infrastructure/config/container'
import { INTERFACE_TYPE } from '../../utils/appConst'
import { authMiddleware } from '../middleware/authMiddleware'
import { collectorController } from '../controllers/collectorController'
import { pickupRequestController } from '../controllers/pickupRequestController'
import { Auth } from 'googleapis'




const AuthMiddleware = container.get<authMiddleware>(INTERFACE_TYPE.authMiddleware)
const controller = container.get<collectorController>(INTERFACE_TYPE.collectorController)
const PickupRequestController = container.get<pickupRequestController>(INTERFACE_TYPE.pickupRequestController)

const router = express.Router()

router.use(AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector'))

router.get('/profile', controller.onFetchCollector)

router.get('/pickup-requests', PickupRequestController.onGetNearPickupRequest)
router.get('/pickup-request/:id', PickupRequestController.ongetPickupRequestById)
router.patch('/pickup-request/accept',  PickupRequestController.onAcceptRequest)



export default router