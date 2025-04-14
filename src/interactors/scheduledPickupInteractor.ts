import { inject, injectable } from "inversify";
import { IScheduledPickupInteractor } from "../interfaces/interactors/IScheduledPickupInteractor";
import { ISubscriptionDocument } from "../interfaces/documents/ISubscriptionDocument";
import { INTERFACE_TYPE } from "../utils/appConst";
import { IScheduledPickupRepository } from "../interfaces/repositories/IScheduledRepository";
import { IScheduledPickupDocument } from "../interfaces/documents/IScheduledPickupDocument";
import { IPickupRequestRepository } from "../interfaces/repositories/IPickupRequestRepository";
import { notFound } from "../domain/errors";

@injectable()
export class scheduledPickupInteractor implements IScheduledPickupInteractor{
    constructor(@inject(INTERFACE_TYPE.scheduledPickupRepository) private scheduledPickupRepository: IScheduledPickupRepository,
@inject(INTERFACE_TYPE.pickupRequestRepository) private pickupRequestRepository: IPickupRequestRepository) {}
    async getCollectorScheduledPickups(collectorId: string): Promise<IScheduledPickupDocument[]> {
        return await this.scheduledPickupRepository.findCollectorScheduledPickups(collectorId)
    }

    async completeScheduledPickup(scheduledPickupId: string): Promise<void> {

        // Update Scheduled Pickup
        const scheduledPickup = await this.scheduledPickupRepository.findByIdAndUpdate(scheduledPickupId, {status: 'completed', completedAt: new Date() })

        // Find Pickup Request
        const pickupRequest = await this.pickupRequestRepository.findById(scheduledPickup.pickupRequestId)
        if(!pickupRequest || pickupRequest.type !== 'subscription'){
            throw new notFound('pickup request not found or invalid')
        }

        // Update Pickup Request
        const updatedCompletedPickups = pickupRequest.completedPickups + 1
        const updatedPickupRequestData: {completedPickups: number,status?: string } = {
            completedPickups: updatedCompletedPickups
        }

        if(updatedCompletedPickups === pickupRequest.totalPickups  ){
            updatedPickupRequestData['status'] = 'completed'
        }

        await this.pickupRequestRepository.findByIdAndUpdate(pickupRequest._id, updatedPickupRequestData)


    }
}