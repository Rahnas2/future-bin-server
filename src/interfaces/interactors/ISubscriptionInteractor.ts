import { Subscription } from "../../domain/entities/subscription";
import { editSubscriptionDto } from "../../dtos/editSubscriptionDto";

export interface ISubscriptionInteractor {
    fetchSubscriptions(): Promise<Subscription[] | null>
    addSubscription(data: Subscription): Promise<Subscription>
    deleteSubscription(id: string): Promise<void>
    editSubscription(id: string, data: editSubscriptionDto): Promise<Subscription | null>
}