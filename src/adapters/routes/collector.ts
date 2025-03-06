import express from 'express'

import { Container } from 'inversify'
import { INTERFACE_TYPE } from '../../utils/appConst'
import { userManagmentInteractor } from '../../interactors/userManagmentInteractor'
import { authMiddleware } from '../middleware/authMiddleware'
import { jwtService } from '../../infrastructure/services/jwtService'
import { userRepository } from '../../infrastructure/database/repositories/userRepository'
import { collectorRepoitory } from '../../infrastructure/database/repositories/collectorRepository'
import { cloudinaryService } from '../../infrastructure/services/cloudinaryService'
import upload from '../middleware/multer'
import { collectorController } from '../controllers/collectorController'
import { emailService } from '../../infrastructure/services/emailService'

const container = new Container

container.bind(INTERFACE_TYPE.jwtService).to(jwtService)
container.bind(INTERFACE_TYPE.cloudinaryService).to(cloudinaryService)
container.bind(INTERFACE_TYPE.emailService).to(emailService)


container.bind(INTERFACE_TYPE.userRepository).to(userRepository)
container.bind(INTERFACE_TYPE.collectorRepoitory).to(collectorRepoitory)

container.bind(INTERFACE_TYPE.userManagmentInteractor).to(userManagmentInteractor) 

container.bind(INTERFACE_TYPE.authMiddleware).to(authMiddleware)
container.bind(INTERFACE_TYPE.collectorController).to(collectorController)

const AuthMiddleware = container.get<authMiddleware>(INTERFACE_TYPE.authMiddleware)
const controller = container.get<collectorController>(INTERFACE_TYPE.collectorController)


const router = express.Router()

router.get('/profile', AuthMiddleware.validateJwt, controller.onFetchCollector)



export default router