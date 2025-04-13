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
import { requestCancellationDto } from "../dtos/requestCancellationDto";
import { IPickupeRequestDocument } from "../interfaces/documents/IPickupRequestDocument";
import { pickupRequestStatusDto } from "../dtos/pickupReqeustStatusDto";


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
        // const activeCollectorsId = await this.collectorRepoitory.findActiveCollectorsByUserId(usersIds)

        // if (!activeCollectorsId || !activeCollectorsId.length) {
        //     throw new notFound("Sorry no collectors are active in your area")
        // }

        //create request and store _id
        const requestId = await this.pickupRequestRepository.createRequest(requestData)

        // Assigning request notification to near collectors
        usersIds.forEach(userId => {
            this.SocketService.sentNotification(userId, 'new-request', requestId)
        });

    }

    async getPickupRequestByCollectorId(id: string): Promise<PickupRequest[] | []> {

        const user = await this.userRepository.findUserById(id)
        if (!user) {
            throw new notFound('user not found')
        }

        const location = user.address.location

        const reuslt =  await this.pickupRequestRepository.findPendingRequestsWithLocation(location, 5000)   
        console.log('reuslt from interactor ', reuslt)
        return reuslt

    }

    async getPickupRequestById(id: string): Promise<PickupRequest> {
        const request = await this.pickupRequestRepository.findById(id)

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

        //create payment intent 
        let paymentIntent = await this.stripService.createPaymentIntent(request.totalAmount * 100, request.userId.toString())

        //updated request
        const updatedData = {
            collectorId: collectorId,
            collectorName: collectorName,
            status: 'accepted',
            assignedAt: new Date(Date.now()),
            paymentIntentId: paymentIntent.id
        }


        //if the request was subscription update the (subscriptionPlanId) on the user collection,
        //and cancell the previous subscription 
        if (request.type === 'subscription') {
            await this.userRepository.findByIdAndUpdate(request.userId, { subscriptionPlanId: request.subscriptionPlanId })

            await this.pickupRequestRepository.findByUserIdAndStatusThenUpdate(request.userId, 'accepted', { status: 'canelled' })
        }



        const updatedRequest = await this.pickupRequestRepository.findByIdAndUpdate(requestId, updatedData)

        if (paymentIntent) {
            //store notification in the database 
            const data = {
                userId: updatedRequest.userId,
                type: 'payment_request',
                message: `your ${request.type} is accepted by ${collectorName} please pay ${request.totalAmount} to confirm the request`,
                clientSecret: paymentIntent.clientSecret,
                requestId
            }

            const result = await this.notificationRepository.create(data)

            this.SocketService.sentNotification(updatedRequest.userId.toString(), 'payment-request', {
                id: result._id,
                message: `your ${request.type} is accepted by ${collectorName} please pay ${request.totalAmount} to confirm the request`,
                clientSecret: paymentIntent.clientSecret,
                requestId
            })
        }

    }


    async updatePickupRequest(id: string, data: Partial<PickupRequest>): Promise<IPickupeRequestDocument> {
        return await this.pickupRequestRepository.findByIdAndUpdate(id, data)
    }

    async cancelRequest(id: string, role: "resident" | "collector", data: Partial<requestCancellationDto>): Promise<IPickupeRequestDocument> {
        const updatedData = {
            status: 'cancelled',
            cancellation: {
                cancelledBy: role,
                reason: data.reason as string,
                ...data
            }
        }

        const result = await this.pickupRequestRepository.findByIdAndUpdate(id, updatedData)

        let refundAmount = 0
            if (result.paidAmount > 0 && result.type === 'on-demand') {
                role === 'collector' ? refundAmount = result.totalAmount  : refundAmount = 90 * result.totalAmount / 100
            } else if (result.paidAmount > 0 && result.type === 'subscription') {
                role === 'collector' ? refundAmount = result.totalAmount : refundAmount = 0
            }

            if (refundAmount > 0) {
                await this.stripService.createRefund(result.paymentIntentId!, refundAmount)
            }

        return await this.pickupRequestRepository.findById(id)
    }

    async updatePaymentStatus(requestId: string, paymentStatus: string) {
        await this.pickupRequestRepository.findByIdAndUpdate(requestId, { paymentStatus })
    }

    async userPickupRequestHistoryByStatus(id: string, role: string, status: 'all' | pickupRequestStatusDto, page: number, limit: number): Promise<{requests: PickupRequest[] , total: number }> {


        if (role === 'resident') {
            const result =  await this.pickupRequestRepository.findReqeustHistoryByUserIdAndStatus(id, status, page, limit)
            return result
        }

        const result =  this.pickupRequestRepository.findReqeustHistoryByCollectorIdAndStatus(id, status, page, limit)
        return result
    }

}