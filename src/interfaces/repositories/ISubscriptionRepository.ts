import { promises } from "dns";
import { Subscription } from "../../domain/entities/subscription";
import { editSubscriptionDto } from "../../dtos/editSubscriptionDto";
import { IBaseRepository } from "./IBaseRepository";
import { ISubscriptionDocument } from "../documents/ISubscriptionDocument";

export interface ISubscriptionRepository extends IBaseRepository<ISubscriptionDocument>{

    // findAllSubscriptions(): Promise<Subscription[] | null>
    // findSubscriptionById(id: string): Promise<Subscription | null>

    findSubscriptionByName(name: string): Promise<Subscription | null>

    // deleteSubscriptionById(id: string): Promise<void>

    // addSubscription(data: Subscription): Promise<Subscription>

    updateSubscriptionData(id: string, updatedData: Partial<editSubscriptionDto['updatedData']>): Promise<Subscription | null>


    addNewFeatures(id: string, newFeatures: string[]): Promise<Subscription | null>
    editFeatures(id: string, editedFeatures: {index: number, value: string}[]): Promise<Subscription | null>
    overrideFeatures(id: string, features: string[]): Promise<Subscription | null>
    removeFeature(id: string, removedFeatures: number[]): Promise<Subscription | null>
}