import { collectorController } from "../adapters/controllers/collectorController";
import { userInteractor } from "../interactors/userInteractor";




export const INTERFACE_TYPE = {
    otpInteractor: Symbol.for("otpInteractor"),
    otpController: Symbol.for("otpController"),
    otpService: Symbol.for("otpService"),    
    authController: Symbol.for("authController"),
    authInteractor: Symbol.for("authInteractor"),
    authRepository: Symbol.for("authRepository"),
    redisRepository: Symbol.for("redisRepository"),
    cloudinaryService: Symbol.for('cloudinaryService'),
    jwtService: Symbol.for('jwtService'),
    hashingService: Symbol.for('hashingService'),
    emailService: Symbol.for('emailService'),
    userRepository: Symbol.for('userRepository'),
    
    adminController: Symbol.for('adminController'),
    adminInteractor: Symbol.for('adminInteractor'),
    adminRepository: Symbol.for('adminRepository'),
    
    userManagmentController: Symbol.for('userManagmentController'),
    userManagmentInteractor: Symbol.for('userManagmentInteractor'),

    collectorRepoitory: Symbol.for('collectorRepoitory'),
    
    authMiddleware: Symbol.for('authMiddleware'),

    userController: Symbol.for('userController'),
    userInteractor: Symbol.for('userInteractor'),

    collectorController: Symbol.for('collectorController')
}