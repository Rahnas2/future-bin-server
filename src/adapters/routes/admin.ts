import express from 'express'
import { Container } from 'inversify'
import { INTERFACE_TYPE } from '../../utils/appConst'
import { adminController } from '../controllers/adminController'
import { adminRepository } from '../../infrastructure/database/repositories/adminRepository'
import { adminInteractor } from '../../interactors/adminInteractor'
import { hashingService } from '../../infrastructure/services/hashingService'
import { jwtService } from '../../infrastructure/services/jwtService'
import { userManagmentController } from '../controllers/userManagmentCotroller'
import { userManagmentInteractor } from '../../interactors/userManagmentInteractor'
import { userRepository } from '../../infrastructure/database/repositories/userRepository'
import { collectorRepoitory } from '../../infrastructure/database/repositories/collectorRepository'
import { emailService } from '../../infrastructure/services/emailService'
import { authMiddleware } from '../middleware/authMiddleware'

const container = new Container()

container.bind(INTERFACE_TYPE.adminRepository).to(adminRepository)
container.bind(INTERFACE_TYPE.userRepository).to(userRepository)
container.bind(INTERFACE_TYPE.collectorRepoitory).to(collectorRepoitory)

container.bind(INTERFACE_TYPE.adminInteractor).to(adminInteractor)
container.bind(INTERFACE_TYPE.hashingService).to(hashingService)
container.bind(INTERFACE_TYPE.jwtService).to(jwtService)
container.bind(INTERFACE_TYPE.emailService).to(emailService)

container.bind(INTERFACE_TYPE.authMiddleware).to(authMiddleware)

container.bind(INTERFACE_TYPE.userManagmentInteractor).to(userManagmentInteractor)

container.bind(INTERFACE_TYPE.adminController).to(adminController)
container.bind(INTERFACE_TYPE.userManagmentController).to(userManagmentController)

const controller = container.get<adminController>(INTERFACE_TYPE.adminController )
const userManagment = container.get<userManagmentController>(INTERFACE_TYPE.userManagmentController)
const AuthMiddleware = container.get<authMiddleware>(INTERFACE_TYPE.authMiddleware)

const router = express.Router()


router.post('/login',controller.onLogin)

router.get('/fetch-users', AuthMiddleware.validateJwt,  userManagment.onFetchUsers)
router.get('/user/view-detail', AuthMiddleware.validateJwt, userManagment.onUserDetail)
router.patch('/user/status', AuthMiddleware.validateJwt, userManagment.onToggleStatus)

router.get('/collectors', AuthMiddleware.validateJwt, userManagment.onFetchCollectors)
router.get('/collector/view-detail', AuthMiddleware.validateJwt, userManagment.onCollectorDetail)
router.patch('/collector/request/approve', AuthMiddleware.validateJwt, userManagment.onAcceptRequest)
router.patch('/collector/request/reject', AuthMiddleware.validateJwt, userManagment.onRejectRequest)



export default router