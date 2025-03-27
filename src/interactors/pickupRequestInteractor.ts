import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils/appConst";
import { pickupRequestRepository } from "../infrastructure/database/repositories/pickupRequestRepository";
import { IPickupRequestRepository } from "../interfaces/repositories/IPickupRequestRepository";
import { IPickupRequestInteractor } from "../interfaces/interactors/IPickupRequestInteractor";
import { PickupRequest } from "../domain/entities/picupRequest";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { conflictError, DatabaseError, notFound } from "../domain/errors";
import { ICollectorRepository } from "../interfaces/repositories/ICollectorRepository";
import { ISocketService } from "../interfaces/services/ISocketService";
import { locationDto } from "../dtos/locationDto";
import { IStripService } from "../interfaces/services/IStripService";
import { INotificationRepository } from "../interfaces/repositories/INotificationRepository";


@injectable()
export class pickupRequestInteractor implements IPickupRequestInteractor {
    constructor(@inject(INTERFACE_TYPE.pickupRequestRepository) private pickupRequestRepository: IPickupRequestRepository,
        @inject(INTERFACE_TYPE.userRepository) private userRepository: IUserRepository,
        @inject(INTERFACE_TYPE.collectorRepoitory) private collectorRepoitory: ICollectorRepository,
        @inject(INTERFACE_TYPE.SocketService) private SocketService: ISocketService,
        @inject(INTERFACE_TYPE.stripeService) private stripService: IStripService,
        @inject(INTERFACE_TYPE.notificationRepository) private notificationRepository: INotificationRepository
    ) { }

    async createPickupRequest(requestData: PickupRequest): Promise<void> {

        //request location 
        const requestLocation = requestData.address.location

        // Find within 5km radius
        const users = await this.userRepository.findNearCollectorsId(requestLocation, 5000)
        //if no collectors found
        if (!users || !users.length) {
            throw new notFound("Sorry No nearby collectors found")
        }

        //extract id's from collectors array
        const usersIds = users.map(collector => collector._id);

        //find active collectors from nearby collectors
        const activeCollectorsId = await this.collectorRepoitory.findActiveCollectorsByUserId(usersIds)

        if (!activeCollectorsId || !activeCollectorsId.length) {
            throw new notFound("Sorry no collectors are active in your area")
        }

        //create request and store _id
        const requestId = await this.pickupRequestRepository.createRequest(requestData)

        // Assigning request notification to near collectors
        activeCollectorsId.forEach(collector => {
            this.SocketService.sentNotification(collector.userId.toString(), 'new-request', requestId)
        });

    }

    async getPickupRequestByCollectorId(id: string): Promise<PickupRequest[] | []> {

        const user = await this.userRepository.findUserById(id)
        if (!user) {
            throw new notFound('user not found')
        }

        const location = user.address.location

        return await this.pickupRequestRepository.findPendingRequestsWithLocation(location, 5000)

    }

    async getPickupRequestById(id: string): Promise<PickupRequest> {
        const request = await this.pickupRequestRepository.findRequestById(id)

        if (!request) {
            throw new notFound('request not found')
        }
        return request
    }

    async acceptRequest(collectorId: string, requestId: string, collectorName: string): Promise<void> {

        //confirm the request status is pending
        const request = await this.pickupRequestRepository.findById(requestId)
        if (request.status !== 'pending') {
            throw new conflictError(`Cannot accept request. current status is ${request.status}`)
        }

        //updated request
        const updatedData = {
            collectorId: collectorId,
            collectorName: collectorName,
            status: 'accepted',
            assignedAt: new Date(Date.now())
        }



        //if the request was subscription update the (subscriptionPlanId) on the user collection,
        //and cancell the previous subscription 
        if (request.type === 'subscription') {
            await this.userRepository.findByIdAndUpdate(request.userId, { subscriptionPlanId: request.subscriptionPlanId })

            await this.pickupRequestRepository.findByUserIdAndStatusThenUpdate(request.userId, 'accepted', { status: 'canelled' })
        }

        const updatedRequest = await this.pickupRequestRepository.findByIdAndUpdate(requestId, updatedData)
        console.log('updated request ')

        // Handle payment based on request type
        // let paymentIntent;
        // let Amount = request.price * 100
        // if (request.type === 'subscription') {
        //     paymentIntent = await this.stripService.createPaymentIntent(Amount)
        // } else if (request.type === 'on-demand') {
        //     Amount = Amount * 0.3
        //     paymentIntent = await this.stripService.createPaymentIntent(Amount)
        // }

        let paymentIntent = await this.stripService.createPaymentIntent(request.price * 100)

        console.log('payment intent', paymentIntent)

        if (paymentIntent) {
            //store notification in the database 
            const data = {
                userId: updatedRequest.userId,
                message: `your ${request.type} is accepted by ${collectorName} please pay ${request.price} to confirm the request`,
                clientSecret: paymentIntent.clientSecret,
                requestId
            }

            const result = await this.notificationRepository.create(data)

            this.SocketService.sentNotification(updatedRequest.userId.toString(), 'payment-request', {
                id: result._id,
                message: `your ${request.type} is accepted by ${collectorName} please pay ${request.price} to confirm the request`,
                clientSecret: paymentIntent.clientSecret,
                requestId
            })
        }

    }

    async updatePaymentStatus(requestId: string, paymentStatus: string) {
        await this.pickupRequestRepository.findByIdAndUpdate(requestId, { paymentStatus })
    }

    async userPickupRequestHistory(id: string, role: string): Promise<PickupRequest[] | []> {

        if (role === 'resident') {
            return await this.pickupRequestRepository.findReqeustHistoryByUserId(id)
        }

        return this.pickupRequestRepository.findReqeustHistoryByCollectorId(id)
    }

}