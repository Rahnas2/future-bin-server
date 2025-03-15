import express from 'express'

import { INTERFACE_TYPE } from '../../utils/appConst'
import container from '../../infrastructure/config/container'

import { authController } from '../controllers/authController'


import upload from '../middleware/multer'



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

router.get('/register/basic-info/google', controller.onBasicInfoGoogle)
router.get('/login/google', controller.onGoogleLogin)

router.post('/login/facebook', controller.onFacebookLogin)
router.post('/register/basic-info/facebook', controller.onbasicInfoFB)

router.post('/forgot-password', controller.onForgotPassword)
router.post('/reset-password', controller.onResetPassword)

router.post('/logout', controller.onLogOut)


export default router