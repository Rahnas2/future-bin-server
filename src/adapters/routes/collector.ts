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

router.get('/profile',AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector'), controller.onFetchCollector)

router.route('/')
.patch(AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector', 'admin'), controller.onPatchUpdates)

router.get('/my-earnings', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector'), controller.onGetMyEarnings)

router.post('/money/withdraw', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector'), controller.onWithdrawBalance)

router.get('/onboarding-link/:stripeAccountId', AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector'), controller.onGetOnboardingLink)

router.put('/pickup-request/completed',AuthMiddleware.validateJwt, AuthMiddleware.restrictTo('collector'), PickupRequestController.onCompleteRequest)


//payment 
router.post('/create-payment-session',AuthMiddleware.validateJwt, PaymentController.OncreatePaymentSession)    



export default router