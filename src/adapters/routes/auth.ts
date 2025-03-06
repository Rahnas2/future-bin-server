import express from 'express'
import { Container } from 'inversify'
import { INTERFACE_TYPE } from '../../utils/appConst'
// import { otpInteractor } from '../../interactors/otpInteractor'
import { otpService } from '../../infrastructure/services/otpService'
import { authController } from '../controllers/authController'
import { authInteractor } from '../../interactors/authInteractor'
import { authRepository } from '../../infrastructure/database/repositories/authRepository'
import { redisRepository } from '../../infrastructure/database/repositories/redisRepository'

import upload from '../middleware/multer'
import { cloudinaryService } from '../../infrastructure/services/cloudinaryService'
import { jwtService } from '../../infrastructure/services/jwtService'
import { hashingService } from '../../infrastructure/services/hashingService'
import { userRepository } from '../../infrastructure/database/repositories/userRepository'

const container = new Container()

container.bind(INTERFACE_TYPE.otpService).to(otpService)
container.bind(INTERFACE_TYPE.authInteractor).to(authInteractor)
container.bind(INTERFACE_TYPE.authRepository).to(authRepository)
container.bind(INTERFACE_TYPE.userRepository).to(userRepository)
container.bind(INTERFACE_TYPE.redisRepository).to(redisRepository)
container.bind(INTERFACE_TYPE.cloudinaryService).to(cloudinaryService)
container.bind(INTERFACE_TYPE.jwtService).to(jwtService)
container.bind(INTERFACE_TYPE.hashingService).to(hashingService)

container.bind(INTERFACE_TYPE.authController).to(authController)

const controller = container.get<authController>(INTERFACE_TYPE.authController)

const router = express.Router()

// router.post('/sent-otp',controller.onSentOTP)
// router.post('verify-otp', controller.onVerifyOTP)

//register 
router.post('/register/basic-info', controller.onbasicInfo)
router.post('/register/verify-otp', controller.onVerfiyOtp)
router.post('/register/update-role', controller.onUpdateRole)
router.post('/register/complete-profile', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'idCardFront', maxCount: 1 },
    { name: 'idCardBack', maxCount: 1 },
    { name: 'vehicleImage', maxCount: 1 },
]),
    controller.onCompleteProfile)
    
router.post('/resent-otp', controller.onResentOtp)



router.post('/login', controller.onLogin)

router.get('/refresh-token', controller.onRefreshToken)

router.get('/login/google', controller.onGoogleLogin)

router.post('/logout', controller.onLogOut)


export default router