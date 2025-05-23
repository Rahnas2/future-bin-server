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
import { stripeService } from "../services/stripService";
import { notificationRepository } from "../database/repositories/notificationRepository";
import { notificationController } from "../../adapters/controllers/notificationController";
import { notificationInteractor } from "../../interactors/notificationInteractor";
import { chatController } from "../../adapters/controllers/chatController";
import { messagRepository } from "../database/repositories/messageRepository";
import { chatInteractor } from "../../interactors/chatInteractor";
import { chatRepository } from "../database/repositories/chatRepository";
import { wasteTypeRepository } from "../database/repositories/wasteTypeRepository";
import { wasteTypeInteractor } from "../../interactors/wasteTypeInteractor";
import { wasteTypeController } from "../../adapters/controllers/wasteTypeController";
import { paymentController } from "../../adapters/controllers/paymentController";
import { paymentInteractor } from "../../interactors/paymentInteractor";
import { cloudinaryController } from "../../adapters/controllers/cloudinaryController";
import { webhookController } from "../../adapters/controllers/webhookController";
import { reviewController } from "../../adapters/controllers/reviewController";
import { reviewInteractor } from "../../interactors/reviewInteractor.ts";
import { reveiwRepository } from "../database/repositories/reviewRepository";
import { scheduledPickupRepository } from "../database/repositories/scheduledPickupRepository";
import { scheduledPickupInteractor } from "../../interactors/scheduledPickupInteractor";
import { scheduledPickupController } from "../../adapters/controllers/scheduledPickupController";
import { collectorInteractor } from "../../interactors/collectorInteractor";
import { transactionRepository } from "../database/repositories/transactionRepository";
import { transactionInteractor } from "../../interactors/transactionInteractor";
import { transactionController } from "../../adapters/controllers/transactionController";
import { overviewInteractor } from "../../interactors/overviewInteractor";
import { overviewController } from "../../adapters/controllers/overviewController";

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
container.bind(INTERFACE_TYPE.stripeService).to(stripeService)



//repositories
container.bind(INTERFACE_TYPE.authRepository).to(authRepository)
container.bind(INTERFACE_TYPE.userRepository).to(userRepository)
container.bind(INTERFACE_TYPE.redisRepository).to(redisRepository)
container.bind(INTERFACE_TYPE.adminRepository).to(adminRepository)
container.bind(INTERFACE_TYPE.collectorRepoitory).to(collectorRepoitory)
container.bind(INTERFACE_TYPE.subscriptionRepositoy).to(subscriptionRepositoy)
container.bind(INTERFACE_TYPE.pickupRequestRepository).to(pickupRequestRepository)
container.bind(INTERFACE_TYPE.socketRepository).to(socketRepository),
container.bind(INTERFACE_TYPE.notificationRepository).to(notificationRepository),
container.bind(INTERFACE_TYPE.messagRepository).to(messagRepository),
container.bind(INTERFACE_TYPE.chatRepository).to(chatRepository),
container.bind(INTERFACE_TYPE.wasteTypeRepository).to(wasteTypeRepository)
container.bind(INTERFACE_TYPE.reveiwRepository).to(reveiwRepository)
container.bind(INTERFACE_TYPE.scheduledPickupRepository).to(scheduledPickupRepository)
container.bind(INTERFACE_TYPE.transactionRepository).to(transactionRepository)


//interactors
container.bind(INTERFACE_TYPE.authInteractor).to(authInteractor)
container.bind(INTERFACE_TYPE.adminInteractor).to(adminInteractor)
container.bind(INTERFACE_TYPE.userInteractor).to(userInteractor)
container.bind(INTERFACE_TYPE.collectorInteractor).to(collectorInteractor)
container.bind(INTERFACE_TYPE.userManagmentInteractor).to(userManagmentInteractor)
container.bind(INTERFACE_TYPE.subscriptionInteractor).to(subscriptionInteractor)
container.bind(INTERFACE_TYPE.pickupRequestInteractor).to(pickupRequestInteractor)
container.bind(INTERFACE_TYPE.notificationInteractor).to(notificationInteractor)
container.bind(INTERFACE_TYPE.chatInteractor).to(chatInteractor)
container.bind(INTERFACE_TYPE.wasteTypeInteractor).to(wasteTypeInteractor)
container.bind(INTERFACE_TYPE.paymentInteractor).to(paymentInteractor)
container.bind(INTERFACE_TYPE.reviewInteractor).to(reviewInteractor)
container.bind(INTERFACE_TYPE.scheduledPickupInteractor).to(scheduledPickupInteractor)
container.bind(INTERFACE_TYPE.transactionInteractor).to(transactionInteractor)
container.bind(INTERFACE_TYPE.overviewInteractor).to(overviewInteractor)


//controllers
container.bind(INTERFACE_TYPE.authController).to(authController)
container.bind(INTERFACE_TYPE.adminController).to(adminController)
container.bind(INTERFACE_TYPE.userManagmentController).to(userManagmentController)
container.bind(INTERFACE_TYPE.subscriptionController).to(subscriptionController)
container.bind(INTERFACE_TYPE.collectorController).to(collectorController)
container.bind(INTERFACE_TYPE.userController).to(userController)
container.bind(INTERFACE_TYPE.pickupRequestController).to(pickupRequestController)
container.bind(INTERFACE_TYPE.notificationController).to(notificationController)
container.bind(INTERFACE_TYPE.chatController).to(chatController)
container.bind(INTERFACE_TYPE.wasteTypeController).to(wasteTypeController)
container.bind(INTERFACE_TYPE.paymentController).to(paymentController)
container.bind(INTERFACE_TYPE.cloudinaryController).to(cloudinaryController)
container.bind(INTERFACE_TYPE.webhookController).to(webhookController)
container.bind(INTERFACE_TYPE.reviewController).to(reviewController)
container.bind(INTERFACE_TYPE.scheduledPickupController).to(scheduledPickupController)
container.bind(INTERFACE_TYPE.transactionController).to(transactionController)
container.bind(INTERFACE_TYPE.overviewController).to(overviewController)


//middlewares
container.bind(INTERFACE_TYPE.authMiddleware).to(authMiddleware)


export default container