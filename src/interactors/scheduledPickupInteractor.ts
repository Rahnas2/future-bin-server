import { inject, injectable } from "inversify";
import { IScheduledPickupInteractor } from "../interfaces/interactors/IScheduledPickupInteractor";
import { ISubscriptionDocument } from "../interfaces/documents/ISubscriptionDocument";
import { INTERFACE_TYPE } from "../utils/appConst";
import { IScheduledPickupRepository } from "../interfaces/repositories/IScheduledRepository";
import { IScheduledPickupDocument } from "../interfaces/documents/IScheduledPickupDocument";
import { IPickupRequestRepository } from "../interfaces/repositories/IPickupRequestRepository";
import { notFound } from "../domain/errors";
import { IPickupRequestInteractor } from "../interfaces/interactors/IPickupRequestInteractor";

@injectable()
export class scheduledPickupInteractor implements IScheduledPickupInteractor {
    constructor(@inject(INTERFACE_TYPE.scheduledPickupRepository) private scheduledPickupRepository: IScheduledPickupRepository,
        @inject(INTERFACE_TYPE.pickupRequestRepository) private pickupRequestRepository: IPickupRequestRepository,
        @inject(INTERFACE_TYPE.pickupRequestInteractor) private pickupRequestInteractor: IPickupRequestInteractor) { }
    async getCollectorScheduledPickups(collectorId: string): Promise<IScheduledPickupDocument[]> {
        return await this.scheduledPickupRepository.findCollectorScheduledPickups(collectorId)
    }

    async completeScheduledPickup(scheduledPickupId: string): Promise<void> {

        // Update Scheduled Pickup
        const scheduledPickup = await this.scheduledPickupRepository.findByIdAndUpdate(scheduledPickupId, { status: 'completed', completedAt: new Date() })

        // Find Pickup Request
        const pickupRequest = await this.pickupRequestRepository.findById(scheduledPickup.pickupRequestId)
        if (!pickupRequest || pickupRequest.type !== 'subscription') {
            throw new notFound('pickup request not found or invalid')
        }

        // Update Pickup Request
        const updatedCompletedPickups = pickupRequest.subscription.completedPickups + 1
        // const updatedPickupRequestData: { completedPickups: number, status?: string } = {
        //     completedPickups: updatedCompletedPickups
        // }

        if (updatedCompletedPickups === pickupRequest.subscription.totalPickups) {
            await this.pickupRequestInteractor.completeRequest(pickupRequest._id)
            // updatedPickupRequestData['status'] = 'completed'
        }

        // await this.pickupRequestRepository.findByIdAndUpdate(pickupRequest._id, updatedPickupRequestData)

        const updatedSubscription = {
            ...pickupRequest.subscription,
            completedPickups: updatedCompletedPickups
        }

        await this.pickupRequestRepository.findByIdAndUpdate(pickupRequest._id, { subscription: updatedSubscription })

    }


    async getScheduledPickupsForTheRequest(pickupRequestId: string): Promise<IScheduledPickupDocument[]> {
        return await this.scheduledPickupRepository.findByRequestId(pickupRequestId)
    }
}