import { Subscription } from "../../domain/entities/subscription";
import { editSubscriptionDto } from "../../dtos/editSubscriptionDto";
import { ISubscriptionDocument } from "../documents/ISubscriptionDocument";

export interface ISubscriptionInteractor {
    fetchSubscriptions(page: number, limit: number): Promise<{subscriptions: Subscription[] , total: number}>
    fetchSubscriptionById(id: string) : Promise<ISubscriptionDocument>
    addSubscription(data: Subscription): Promise<Subscription>
    deleteSubscription(id: string): Promise<void>
    editSubscription(id: string, data: editSubscriptionDto): Promise<Subscription | null>
}