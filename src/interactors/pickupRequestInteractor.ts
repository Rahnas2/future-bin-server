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
import { notificationTypesDto } from "../dtos/notificationTypeDto";
import { ITransactionRepository } from "../interfaces/repositories/ITransactionReporisoty";
import { IScheduledPickupInteractor } from "../interfaces/interactors/IScheduledPickupInteractor";
import { IScheduledPickupRepository } from "../interfaces/repositories/IScheduledRepository";


@injectable()
export class pickupRequestInteractor implements IPickupRequestInteractor {
    constructor(@inject(INTERFACE_TYPE.pickupRequestRepository) private pickupRequestRepository: IPickupRequestRepository,
        @inject(INTERFACE_TYPE.userRepository) private userRepository: IUserRepository,
        @inject(INTERFACE_TYPE.collectorRepoitory) private collectorRepoitory: ICollectorRepository,
        @inject(INTERFACE_TYPE.SocketService) private SocketService: ISocketService,
        @inject(INTERFACE_TYPE.stripeService) private stripService: IStripService,
        @inject(INTERFACE_TYPE.notificationRepository) private notificationRepository: INotificationRepository,
        @inject(INTERFACE_TYPE.chatRepository) private chatRepository: IChatRepository,
        @inject(INTERFACE_TYPE.messagRepository) private messagRepository: IMessageRepository,
        @inject(INTERFACE_TYPE.transactionRepository) private transactionRepository: ITransactionRepository,
        @inject(INTERFACE_TYPE.scheduledPickupRepository) private scheduledPickupRepository: IScheduledPickupRepository,
    ) { }

    async createPickupRequest(requestData: PickupRequest): Promise<void> {

        //IF Request Check the User has any prevous 'pending' or 'accepted' or 'confirmed' subscription request
        if (requestData.type === 'subscription') {
            const existingRequest = await this.pickupRequestRepository.checkUserHasSubscription(requestData.userId)
            if (existingRequest && existingRequest.type === 'subscription') {
                const status = existingRequest.status

                const message = status === 'pending'
                    ? 'Your previous subscription request is still pending. Please cancel it before submitting a new request.'
                    : status === 'accepted'
                        ? `Your previous subscription request has been accepted by ${existingRequest.collectorName}. Please complete the payment to activate it, or cancel it to proceed with a new subscription.`
                        : `You already have an active subscription plan (${existingRequest.subscription.name}). Please cancel your current subscription before creating a new one.`;

                throw new conflictError(message);
            }
        }

        //request location 
        const requestLocation = requestData.address.location
        console.log('request locaion ', requestLocation)
        // Find within 5km radius
        const users = await this.userRepository.findNearCollectorsId(requestLocation, 5000)
        console.log('near collectors ', users)
        //if no collectors found
        if (!users || !users.length) {
            throw new notFound("Sorry No nearby collectors found")
        }

        //extract id's from collectors array
        const usersIds = users.map(collector => collector._id);

        //find active collectors from nearby collectors
        const activeCollectors = await this.collectorRepoitory.findActiveCollectorsByUserId(usersIds)


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

    // Area Data For Collecto r
    async getAreaDataForCollector(collectorId: string): Promise<{ city: string; total: number; pending: number; completed: number; cancelled: number; }[]> {
        return await this.pickupRequestRepository.aggregateAreaDataWithCollectorId(collectorId)
    }

    async getPickupRequestsByTypeAndStatus(type: string, status: string, role: string, userId: string): Promise<PickupRequest[]> {
        if (role === 'collector') {
            return await this.pickupRequestRepository.findCollectorRequestsByTypeAndStatus(userId, type, status)
        } else {
            return await this.pickupRequestRepository.findUserRequestsByTypeAndStatus(userId, type, status)
        }

    }

    async getPickupRequestById(id: string): Promise<PickupRequest> {
        const request = await this.pickupRequestRepository.findByIdAndPopulateCollectorImageEmailMobile(id)
        console.log('request in the interactor ', request)
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
        // if (request.type === 'subscription') {
        //     await this.userRepository.findByIdAndUpdate(request.userId, { subscriptionPlanId: request.subscription.planId })

        //     await this.pickupRequestRepository.findByUserIdAndStatusThenUpdate(request.userId, 'accepted', { status: 'canelled' })
        // }



        const updatedRequest = await this.pickupRequestRepository.findByIdAndUpdate(requestId, updatedData)

        if (paymentIntent) {
            //store notification in the database 
            const data = {
                receiverId: updatedRequest.userId,
                type: "pickup_accepted" as notificationTypesDto,
                message: `your ${request.type} is accepted by ${collectorName} please pay ${request.totalAmount} to confirm the request`,
                requestId
            }

            const notification = await this.notificationRepository.create(data)

            this.SocketService.sentNotification(updatedRequest.userId.toString(), 'pickup_accepted', {
                notification
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
        if (result.paidAmount > 0 && result.type === 'on-demand' && role === 'collector') {
            refundAmount = result.totalAmount
        } else if (result.paidAmount > 0 && result.type === 'subscription' && role === 'collector') {
            const totalAmount = result.totalAmount;
            const totalPickups = result.subscription.totalPickups;
            const completedPickups = await this.scheduledPickupRepository.countFilterDocument({ pickupRequestId: result._id, status: 'completed' })

            // Price per pickup
            const perPickupPrice = totalAmount / totalPickups;

            // Calculate collected waste value ( completed pickups * per pickup price)
            const collectedValue = completedPickups * perPickupPrice;

            // Refund amount = total paid - collected value
            refundAmount = totalAmount - collectedValue;
        }
        if (refundAmount > 0) {
            await this.stripService.createRefund(result.paymentIntentId!, refundAmount)
        }

        //Notification For User
        const notificationDataForUser = {
            receiverId: result.userId,
            type: "pickup_cancelled" as notificationTypesDto,
            message: role === 'resident' ? `Cancelled  ${result.type} due to ${updatedData.cancellation.reason} ` : `${result.collectorName} Cancelled Your ${result.type} due to ${updatedData.cancellation.reason} Money will be refunded to your account`,
            requestId: result._id
        }
        const notification1 = await this.notificationRepository.create(notificationDataForUser)
        this.SocketService.sentNotification(result.userId.toString(), 'pickup_cancelled', {
            notification: notification1
        })

        // For Collector If he Accepted
        if (result.collectorId) {

            //Notification
            const notificationDataForCollector = {
                receiverId: result.collectorId,
                type: "pickup_cancelled" as notificationTypesDto,
                message: role === 'collector' ? `Cancelled ${result.name}  ${result.type} Pickup Request due to ${updatedData.cancellation.reason}` : `User ${result.name} Cancelled his Pickup Request to due to ${result.name}`,
                requestId: result._id
            }
            const notification2 = await this.notificationRepository.create(notificationDataForCollector)
            this.SocketService.sentNotification(notification2.receiverId.toString(), 'pickup_cancelled', {
                notification: notification2
            })

            // Transfet Money To Collector
            const collector = await this.collectorRepoitory.finByUserId(result.collectorId as string)
            if (role === 'resident' && result.paidAmount > 0 && collector[0].stripeAccountId) {

                let serviceAmount = result.totalAmount * 0.5

                // if (result.type === 'subscription') {
                //     const completedPickups = await this.scheduledPickupRepository.countFilterDocument({ pickupRequestId: result._id, status: 'completed' })
                //     if (completedPickups > 0) {
                //         const perPickupServiceAmount = serviceAmount / result.subscription.totalPickups;
                //         serviceAmount = completedPickups * perPickupServiceAmount
                //     } else {
                //         serviceAmount = 0
                //     }
                // }

                // if (serviceAmount > 0) {
                //     const transferAmount = Math.round(serviceAmount * 100)
                //     const transfer = await this.stripService.createTransfer({
                //         amount: transferAmount,
                //         currency: 'usd',
                //         destination: collector[0].stripeAccountId,
                //         transfer_group: result._id.toString(),
                //     })

                const transferAmount = Math.round(serviceAmount * 100)
                const transfer = await this.stripService.createTransfer({
                    amount: transferAmount,
                    currency: 'usd',
                    destination: collector[0].stripeAccountId,
                    transfer_group: result._id.toString(),
                })

                // Store Transfer Details
                await this.transactionRepository.create({
                    paymentId: transfer.id,
                    pickupRequestId: result._id,
                    userId: collector[0].userId,
                    amount: transfer.amount / 100,
                    currency: transfer.currency,
                    type: 'transfered',
                    paymentStatus: 'succeeded'
                })

                // Notification For Transfer 
                const transferNotification = {
                    receiverId: result.collectorId,
                    type: "payment_success" as notificationTypesDto,
                    message: `Transfered ${transfer.amount / 100}`,
                    requestId: result._id
                }
                const notification3 = await this.notificationRepository.create(transferNotification)
                this.SocketService.sentNotification(notification3.receiverId.toString(), 'payment_success', {
                    notification: notification3
                })
        }
    }

    //If chat exist between user and collector delete the chat
    if(result.collectorId) {
        const chat = await this.chatRepository.findSingleChat(result.userId, result.collectorId)
        if (chat) {
            await this.chatRepository.deleteById(chat.id)
            await this.messagRepository.deleteByChatId(chat._id.toString())
        }
    }


        return await this.pickupRequestRepository.findById(id)
    }

    //Complete Pickup Request for on-demand
    async completeRequest(id: string): Promise < IPickupeRequestDocument > {
    const pickupRequest = await this.pickupRequestRepository.findByIdAndUpdate(id, { status: 'completed', completedAt: new Date() })

        if(!pickupRequest) {
        throw new notFound('pickup request not found')
    }

        let refundAmount = 0
        if(pickupRequest.type === 'on-demand' && pickupRequest.paidAmount > pickupRequest.totalAmount) {
    refundAmount = pickupRequest.paidAmount - pickupRequest.totalAmount
} else if (pickupRequest.type === 'subscription') {
    const totalAmount = pickupRequest.totalAmount;
    const totalPickups = pickupRequest.subscription.totalPickups;
    const completedPickups = await this.scheduledPickupRepository.countFilterDocument({ pickupRequestId: pickupRequest._id, status: 'completed' })

    // Price per pickup
    const perPickupPrice = totalAmount / totalPickups;

    // Calculate collected waste value ( completed pickups * per pickup price)
    const collectedValue = completedPickups * perPickupPrice;

    // Refund amount = total paid - collected value
    refundAmount = totalAmount - collectedValue;
}
if (refundAmount > 0) {
    await this.stripService.createRefund(pickupRequest.paymentIntentId!, refundAmount)
}


//Notification
const notificationDataForUser = {
    receiverId: pickupRequest.userId,
    type: "pickup_completed" as notificationTypesDto,
    message: `your ${pickupRequest.type} is successfully Completed by  ${pickupRequest.collectorName} `,
    requestId: pickupRequest._id
}
const notification1 = await this.notificationRepository.create(notificationDataForUser)
this.SocketService.sentNotification(pickupRequest.userId.toString(), 'pickup_completed', {
    notification: notification1
})

const notificationDataForCollector = {
    receiverId: pickupRequest.collectorId,
    type: "pickup_completed" as notificationTypesDto,
    message: `Successfully compleded ${pickupRequest.type} for ${pickupRequest.collectorName} Thanks for your Service `,
    requestId: pickupRequest._id
}
const notification2 = await this.notificationRepository.create(notificationDataForCollector)
this.SocketService.sentNotification(notification2.receiverId.toString(), 'pickup_completed', {
    notification: notification2
})

// Transfet Money To Collector
const collector = await this.collectorRepoitory.finByUserId(pickupRequest.collectorId as string)
if (collector[0].stripeAccountId) {
    let serviceAmount = pickupRequest.totalAmount * 0.5
    console.log('service amount here ', serviceAmount)
    if (pickupRequest.type === 'subscription') {
        const cancelScheduledPickups = await this.scheduledPickupRepository.countFilterDocument({ pickupRequestId: pickupRequest._id, status: 'missed' })
        if (cancelScheduledPickups !== 0) {
            const perPickupServiceAmount = serviceAmount / pickupRequest.subscription.totalPickups;
            serviceAmount = serviceAmount - (cancelScheduledPickups * perPickupServiceAmount)
        }
    }
    const transferAmount = Math.round(serviceAmount * 100)
    const transfer = await this.stripService.createTransfer({
        amount: transferAmount,
        currency: 'usd',
        destination: collector[0].stripeAccountId,
        transfer_group: pickupRequest._id.toString(),
    })

    // Store Transfer Details
    await this.transactionRepository.create({
        paymentId: transfer.id,
        pickupRequestId: pickupRequest._id,
        userId: collector[0].userId,
        amount: transfer.amount / 100,
        currency: transfer.currency,
        type: 'transfered',
        paymentStatus: 'succeeded'
    })

    // Notification For Transfer 
    const transferNotification = {
        receiverId: pickupRequest.collectorId,
        type: "payment_success" as notificationTypesDto,
        message: `Transfered ${transfer.amount / 100}`,
        requestId: pickupRequest._id
    }
    const notification3 = await this.notificationRepository.create(transferNotification)
    this.SocketService.sentNotification(notification3.receiverId.toString(), 'payment_success', {
        notification: notification3
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

    async userPickupRequestHistoryByStatus(id: string, role: string, status: 'all' | pickupRequestStatusDto, page: number, limit: number): Promise < { requests: PickupRequest[], total: number } > {


    if(role === 'resident') {
    const result = await this.pickupRequestRepository.findReqeustHistoryByUserIdAndStatus(id, status, page, limit)
    return result
}

const result = this.pickupRequestRepository.findReqeustHistoryByCollectorIdAndStatus(id, status, page, limit)
return result
    }

}