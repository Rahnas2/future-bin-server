import { collectorController } from "../adapters/controllers/collectorController";
import { pickupRequestController } from "../adapters/controllers/pickupRequestController";
import { subscriptionController } from "../adapters/controllers/subscriptionController";
import { SocketConfig } from "../infrastructure/config/socket";
import { pickupRequestRepository } from "../infrastructure/database/repositories/pickupRequestRepository";
import { socketRepository } from "../infrastructure/database/repositories/socketRepository";
import { subscriptionRepositoy } from "../infrastructure/database/repositories/subscriptionRepository";
import { facebookAuthService } from "../infrastructure/services/facebookAuthService";
import { googleAuthService } from "../infrastructure/services/googleAuthService";
import { SocketService } from "../infrastructure/services/socketService";
import { pickupRequestInteractor } from "../interactors/pickupRequestInteractor";
import { subscriptionInteractor } from "../interactors/subscriptionInteractor";
import { userInteractor } from "../interactors/userInteractor";




export const INTERFACE_TYPE = {
    
    //controllers
    otpController: Symbol.for("otpController"),
    authController: Symbol.for("authController"),
    userController: Symbol.for('userController'),
    adminController: Symbol.for('adminController'),
    collectorController: Symbol.for('collectorController'),
    userManagmentController: Symbol.for('userManagmentController'),
    subscriptionController: Symbol.for('subscriptionController'),
    pickupRequestController: Symbol.for('pickupRequestController'),

    //interactors 
    otpInteractor: Symbol.for("otpInteractor"),
    authInteractor: Symbol.for("authInteractor"),
    userInteractor: Symbol.for('userInteractor'),
    adminInteractor: Symbol.for('adminInteractor'),
    userManagmentInteractor: Symbol.for('userManagmentInteractor'),
    subscriptionInteractor: Symbol.for('subscriptionInteractor'),
    pickupRequestInteractor: Symbol.for('pickupRequestInteractor'),

    //repositories
    redisRepository: Symbol.for("redisRepository"),
    authRepository: Symbol.for("authRepository"),
    userRepository: Symbol.for('userRepository'), 
    adminRepository: Symbol.for('adminRepository'),
    subscriptionRepositoy: Symbol.for('subscriptionRepositoy'),
    collectorRepoitory: Symbol.for('collectorRepoitory'),
    pickupRequestRepository: Symbol.for('pickupRequestRepository'),
    socketRepository: Symbol.for('socketRepository'),

    //services
    otpService: Symbol.for("otpService"),    
    cloudinaryService: Symbol.for('cloudinaryService'),
    jwtService: Symbol.for('jwtService'),
    hashingService: Symbol.for('hashingService'),
    emailService: Symbol.for('emailService'),
    googleAuthService: Symbol.for('googleAuthService'),
    facebookAuthService: Symbol.for('facebookAuthService'),
    SocketService: Symbol.for('SocketService'),

    //middlewares
    authMiddleware: Symbol.for('authMiddleware'),

    SocketConfig: Symbol.for('SocketConfig')
    
}