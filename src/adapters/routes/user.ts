import express from 'express'

import { Container } from 'inversify'
import { INTERFACE_TYPE } from '../../utils/appConst'
import { userManagmentInteractor } from '../../interactors/userManagmentInteractor'
import { userController } from '../controllers/userController'
import { authMiddleware } from '../middleware/authMiddleware'
// import { authController } from '../controllers/authController'
import { jwtService } from '../../infrastructure/services/jwtService'
import { userRepository } from '../../infrastructure/database/repositories/userRepository'
import { collectorRepoitory } from '../../infrastructure/database/repositories/collectorRepository'
import { emailService } from '../../infrastructure/services/emailService'
import { cloudinaryService } from '../../infrastructure/services/cloudinaryService'
import upload from '../middleware/multer'
import { userInteractor } from '../../interactors/userInteractor'

const container = new Container

container.bind(INTERFACE_TYPE.jwtService).to(jwtService)
container.bind(INTERFACE_TYPE.emailService).to(emailService)
container.bind(INTERFACE_TYPE.cloudinaryService).to(cloudinaryService)

container.bind(INTERFACE_TYPE.userRepository).to(userRepository)
container.bind(INTERFACE_TYPE.collectorRepoitory).to(collectorRepoitory)

container.bind(INTERFACE_TYPE.userManagmentInteractor).to(userManagmentInteractor) 
container.bind(INTERFACE_TYPE.userInteractor).to(userInteractor)

container.bind(INTERFACE_TYPE.authMiddleware).to(authMiddleware)

container.bind(INTERFACE_TYPE.userController).to(userController)

const AuthMiddleware = container.get<authMiddleware>(INTERFACE_TYPE.authMiddleware)
const controller = container.get<userController>(INTERFACE_TYPE.userController)



const router = express.Router()


router.get('/profile', AuthMiddleware.validateJwt, controller.onFetchUser)
router.put('/profile', AuthMiddleware.validateJwt, upload.single('profileImage'), controller.onEditUserProfile)

export default router