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
import { IChatRepository } from "../interfaces/repositories/IChatRepository";
import { IMessageRepository } from "../interfaces/repositories/IMessageRepository";


@injectable()
export class pickupRequestInteractor implements IPickupRequestInteractor {
    constructor(@inject(INTERFACE_TYPE.pickupRequestRepository) private pickupRequestRepository: IPickupRequestRepository,
        @inject(INTERFACE_TYPE.userRepository) private userRepository: IUserRepository,
        @inject(INTERFACE_TYPE.collectorRepoitory) private collectorRepoitory: ICollectorRepository,
        @inject(INTERFACE_TYPE.SocketService) private SocketService: ISocketService,
        @inject(INTERFACE_TYPE.stripeService) private stripService: IStripService,
        @inject(INTERFACE_TYPE.notificationRepository) private notificationRepository: INotificationRepository,
        @inject(INTERFACE_TYPE.chatRepository) private chatRepository: IChatRepository,
        @inject(INTERFACE_TYPE.messagRepository) private messagRepository: IMessageRepository
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
        const activeCollectors = await this.collectorRepoitory.findActiveCollectorsByUserId(usersIds)

        console.log('active collectors ', activeCollectors)

        //create request and store _id
        const requestId = await this.pickupRequestRepository.createRequest(requestData)
        console.log('user ids ', usersIds)
        // Assigning request notification to near collectors
        activeCollectors && activeCollectors.forEach(collector => {
            this.SocketService.sentNotification(collector.userId.toString(), 'new-request', requestId)
        });

    }

    async getPickupRequestByCollectorId(id: string): Promise<PickupRequest[] | []> {
        console.log('start interacting 0 ')
        const user = await this.userRepository.findUserById(id)
        console.log('start interacting 1 ')
        if (!user) {
            throw new notFound('user not found')
        }

        const location = user.address.location

        const reuslt = await this.pickupRequestRepository.findPendingRequestsWithLocation(location, 5000)
        console.log('reuslt from interactor ', reuslt)
        return reuslt

    }

    async getPickupRequestsByTypeAndStatus(type: string, status: string, role: string, userId: string): Promise<PickupRequest[]> {
        if (role === 'collector') {
            return await this.pickupRequestRepository.findCollectorRequestsByTypeAndStatus(userId, type, status)
        } else {
            return await this.pickupRequestRepository.findUserRequestsByTypeAndStatus(userId, type, status)
        }

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
            await this.userRepository.findByIdAndUpdate(request.userId, { subscriptionPlanId: request.subscription.planId })

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

    //Cancel pickup request for both on-demand and subscription 
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

        //For Refund
        let refundAmount = 0
        if (result.paidAmount > 0 && result.type === 'on-demand') {
            role === 'collector' ? refundAmount = result.totalAmount : refundAmount = 90 * result.totalAmount / 100
        } else if (result.paidAmount > 0 && result.type === 'subscription') {
            if (role === 'collector') {

                const totalAmount = result.totalAmount;
                const totalPickups = result.subscription.totalPickups;
                const completedPickups = result.subscription.completedPickups;

                // Price per pickup
                const perPickupPrice = totalAmount / totalPickups;

                // Calculate collected waste value ( completed pickups * per pickup price)
                const collectedValue = completedPickups * perPickupPrice;

                // Refund amount = total paid - collected value
                refundAmount = totalAmount - collectedValue;
            }
        }
        if (refundAmount > 0) {
            await this.stripService.createRefund(result.paymentIntentId!, refundAmount)
        }

        //If chat exist between user and collector delete the chat
        if (result.collectorId) {
            const chat = await this.chatRepository.findSingleChat(result.userId, result.collectorId)
            if (chat) {
                await this.chatRepository.deleteById(chat.id)
                await this.messagRepository.deleteByChatId(chat._id.toString())
            }
        }


        return await this.pickupRequestRepository.findById(id)
    }

    //Complete Pickup Request for on-demand
    async completeRequest(id: string): Promise<IPickupeRequestDocument> {
        const pickupRequest = await this.pickupRequestRepository.findByIdAndUpdate(id, { status: 'completed', completedAt: new Date() })

        if (!pickupRequest) {
            throw new notFound('pickup request not found')
        }

        if (pickupRequest.paidAmount > pickupRequest.totalAmount) {
            const refundAmount = pickupRequest.paidAmount - pickupRequest.totalAmount
            await this.stripService.createRefund(pickupRequest.paymentIntentId!, refundAmount)
        }


        // Transfet Money To Collector
        const collector = await this.collectorRepoitory.finByUserId(pickupRequest.collectorId as string)
        if (collector[0].stripeAccountId) {
            const collectorAmountINR = pickupRequest.totalAmount * 0.5;
            // Convert INR to USD (example exchange rate: 1 INR = 0.012 USD)
            const exchangeRate = 0.012; // Update with real-time rate from an API in production
            const collectorAmountUSD = collectorAmountINR * exchangeRate;
            const transferAmount = Math.round(collectorAmountUSD * 100);

            await this.stripService.createTransfer({
                amount: transferAmount,    
                currency: 'usd',
                destination: collector[0].stripeAccountId,     
                transfer_group: pickupRequest._id.toString(),
            })

        }

        // Delete Chat Between User and Collector
        if (pickupRequest.collectorId) {
            const chat = await this.chatRepository.findSingleChat(pickupRequest.userId, pickupRequest.collectorId)
            if (chat) {
                await this.chatRepository.deleteById(chat.id)
                await this.messagRepository.deleteByChatId(chat._id.toString())
            }
        }

        return pickupRequest
    }

    async updatePaymentStatus(requestId: string, paymentStatus: string) {
        await this.pickupRequestRepository.findByIdAndUpdate(requestId, { paymentStatus })
    }

    async userPickupRequestHistoryByStatus(id: string, role: string, status: 'all' | pickupRequestStatusDto, page: number, limit: number): Promise<{ requests: PickupRequest[], total: number }> {


        if (role === 'resident') {
            const result = await this.pickupRequestRepository.findReqeustHistoryByUserIdAndStatus(id, status, page, limit)
            return result
        }

        const result = this.pickupRequestRepository.findReqeustHistoryByCollectorIdAndStatus(id, status, page, limit)
        return result
    }

}