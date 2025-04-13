import express from 'express'

import container from '../../infrastructure/config/container'
import { INTERFACE_TYPE } from '../../utils/appConst'
import { authMiddleware } from '../middleware/authMiddleware'
import { collectorController } from '../controllers/collectorController'
import { pickupRequestController } from '../controllers/pickupRequestController'
import { Auth } from 'googleapis'
import { paymentController } from '../controllers/paymentController'




const AuthMiddleware = container.get<authMiddleware>(INTERFACE_TYPE.authMiddleware)
const controller = container.get<collectorController>(INTERFACE_TYPE.collectorController)
const PickupRequestController = container.get<pickupRequestController>(INTERFACE_TYPE.pickupRequestController)
const PaymentController = container.get<paymentController>(INTERFACE_TYPE.paymentController)

const router = express.Router()

router.patch('/', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector', 'admin'))

router.get('/profile',AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector'), controller.onFetchCollector)

// router.get('/pickup-request/:id',AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('resident, collector'), PickupRequestController.ongetPickupRequestById)
router.patch('/pickup-request/accept',AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector'),  PickupRequestController.onAcceptRequest)
router.put('/pickup-request/completed',AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector'), PickupRequestController.onCompleteRequest)

//payment 
router.post('/create-payment-session',AuthMiddleware.validateJwt, PaymentController.OncreatePaymentSession)



export default router