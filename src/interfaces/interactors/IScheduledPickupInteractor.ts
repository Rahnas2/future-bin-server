import { IScheduledPickupDocument } from "../documents/IScheduledPickupDocument";
import { ISubscriptionDocument } from "../documents/ISubscriptionDocument";

export interface IScheduledPickupInteractor {
    getCollectorScheduledPickups(collectorId: string): Promise<IScheduledPickupDocument []>
    completeScheduledPickup(scheduledPickupId: string): Promise<void>
}