import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils/appConst";
import { otpService } from "../services/otpService";
import { cloudinaryService } from "../services/cloudinaryService";
import { authRepository } from "../database/repositories/authRepository";
import { userRepository } from "../database/repositories/userRepository";
import { redisRepository } from "../database/repositories/redisRepository";
import { jwtService } from "../services/jwtService";
import { hashingService } from "../services/hashingService";
import { googleAuthService } from "../services/googleAuthService";
import { facebookAuthService } from "../services/facebookAuthService";
import { authInteractor } from "../../interactors/authInteractor";
import { authController } from "../../adapters/controllers/authController";
import { adminRepository } from "../database/repositories/adminRepository";
import { collectorRepoitory } from "../database/repositories/collectorRepository";
import { subscriptionRepositoy } from "../database/repositories/subscriptionRepository";
import { adminInteractor } from "../../interactors/adminInteractor";
import { emailService } from "../services/emailService";
import { authMiddleware } from "../../adapters/middleware/authMiddleware";
import { userManagmentInteractor } from "../../interactors/userManagmentInteractor";
import { subscriptionInteractor } from "../../interactors/subscriptionInteractor";
import { adminController } from "../../adapters/controllers/adminController";
import { userManagmentController } from "../../adapters/controllers/userManagmentCotroller";
import { subscriptionController } from "../../adapters/controllers/subscriptionController";
import { collectorController } from "../../adapters/controllers/collectorController";
import { userController } from "../../adapters/controllers/userController";
import { pickupRequestRepository } from "../database/repositories/pickupRequestRepository";
import { socketRepository } from "../database/repositories/socketRepository";
import { SocketService } from "../services/socketService";
import { userInteractor } from "../../interactors/userInteractor";
import { pickupRequestController } from "../../adapters/controllers/pickupRequestController";
import { pickupRequestInteractor } from "../../interactors/pickupRequestInteractor";
import { SocketConfig } from "./socket";

const container = new Container()

container.bind(SocketConfig).toSelf().inSingletonScope();

//services
container.bind(INTERFACE_TYPE.otpService).to(otpService)
container.bind(INTERFACE_TYPE.cloudinaryService).to(cloudinaryService)
container.bind(INTERFACE_TYPE.jwtService).to(jwtService)
container.bind(INTERFACE_TYPE.hashingService).to(hashingService)
container.bind(INTERFACE_TYPE.googleAuthService).to(googleAuthService)
container.bind(INTERFACE_TYPE.facebookAuthService).to(facebookAuthService)
container.bind(INTERFACE_TYPE.emailService).to(emailService)
container.bind(INTERFACE_TYPE.SocketService).to(SocketService)


//repositories
container.bind(INTERFACE_TYPE.authRepository).to(authRepository)
container.bind(INTERFACE_TYPE.userRepository).to(userRepository)
container.bind(INTERFACE_TYPE.redisRepository).to(redisRepository)
container.bind(INTERFACE_TYPE.adminRepository).to(adminRepository)
container.bind(INTERFACE_TYPE.collectorRepoitory).to(collectorRepoitory)
container.bind(INTERFACE_TYPE.subscriptionRepositoy).to(subscriptionRepositoy)
container.bind(INTERFACE_TYPE.pickupRequestRepository).to(pickupRequestRepository)
container.bind(INTERFACE_TYPE.socketRepository).to(socketRepository)


//interactors
container.bind(INTERFACE_TYPE.authInteractor).to(authInteractor)
container.bind(INTERFACE_TYPE.adminInteractor).to(adminInteractor)
container.bind(INTERFACE_TYPE.userInteractor).to(userInteractor)
container.bind(INTERFACE_TYPE.userManagmentInteractor).to(userManagmentInteractor)
container.bind(INTERFACE_TYPE.subscriptionInteractor).to(subscriptionInteractor)
container.bind(INTERFACE_TYPE.pickupRequestInteractor).to(pickupRequestInteractor)


//controllers
container.bind(INTERFACE_TYPE.authController).to(authController)
container.bind(INTERFACE_TYPE.adminController).to(adminController)
container.bind(INTERFACE_TYPE.userManagmentController).to(userManagmentController)
container.bind(INTERFACE_TYPE.subscriptionController).to(subscriptionController)
container.bind(INTERFACE_TYPE.collectorController).to(collectorController)
container.bind(INTERFACE_TYPE.userController).to(userController)
container.bind(INTERFACE_TYPE.pickupRequestController).to(pickupRequestController)


//middlewares
container.bind(INTERFACE_TYPE.authMiddleware).to(authMiddleware)


export default container