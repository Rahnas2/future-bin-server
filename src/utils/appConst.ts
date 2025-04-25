


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
    notificationController: Symbol.for('notificationController'),
    chatController: Symbol.for('chatController'),
    wasteTypeController: Symbol.for('wasteTypeController'),
    paymentController: Symbol.for('paymentController'),
    cloudinaryController: Symbol.for('cloudinaryController'),
    webhookController: Symbol.for('webhookController'),
    reviewController: Symbol.for('reviewController'),
    scheduledPickupController: Symbol.for('scheduledPickupController'),
    transactionController: Symbol.for('transactionController'),

    //interactors 
    otpInteractor: Symbol.for("otpInteractor"),
    authInteractor: Symbol.for("authInteractor"),
    userInteractor: Symbol.for('userInteractor'),
    collectorInteractor: Symbol.for('collectorInteractor'),
    adminInteractor: Symbol.for('adminInteractor'),
    userManagmentInteractor: Symbol.for('userManagmentInteractor'),
    subscriptionInteractor: Symbol.for('subscriptionInteractor'),
    pickupRequestInteractor: Symbol.for('pickupRequestInteractor'),
    notificationInteractor: Symbol.for('notificationInteractor'),
    chatInteractor: Symbol.for('chatInteractor'),
    wasteTypeInteractor: Symbol.for('wasteTypeInteractor'),
    paymentInteractor: Symbol.for('paymentInteractor'),
    reviewInteractor: Symbol.for('reviewInteractor'),
    scheduledPickupInteractor: Symbol.for('scheduledPickupInteractor'),
    transactionInteractor: Symbol.for('transactionInteractor'),

    //repositories
    redisRepository: Symbol.for("redisRepository"),
    authRepository: Symbol.for("authRepository"),
    userRepository: Symbol.for('userRepository'), 
    adminRepository: Symbol.for('adminRepository'),
    subscriptionRepositoy: Symbol.for('subscriptionRepositoy'),
    collectorRepoitory: Symbol.for('collectorRepoitory'),
    pickupRequestRepository: Symbol.for('pickupRequestRepository'),
    socketRepository: Symbol.for('socketRepository'),
    notificationRepository: Symbol.for('notificationRepository'),
    messagRepository: Symbol.for('messagRepository'),
    chatRepository: Symbol.for('chatRepository'),
    wasteTypeRepository: Symbol.for('wasteTypeRepository'),
    reveiwRepository: Symbol.for('reveiwRepository'),
    scheduledPickupRepository: Symbol.for('scheduledPickupRepository'),
    transactionRepository: Symbol.for('transactionRepository'),

    //services
    otpService: Symbol.for("otpService"),    
    cloudinaryService: Symbol.for('cloudinaryService'),
    jwtService: Symbol.for('jwtService'),
    hashingService: Symbol.for('hashingService'),
    emailService: Symbol.for('emailService'),
    googleAuthService: Symbol.for('googleAuthService'),
    facebookAuthService: Symbol.for('facebookAuthService'),
    SocketService: Symbol.for('SocketService'),
    stripeService: Symbol.for('stripeService'),

    //middlewares
    authMiddleware: Symbol.for('authMiddleware'),

    SocketConfig: Symbol.for('SocketConfig')
    
}