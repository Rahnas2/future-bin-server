import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils/appConst";
import { ISubscriptionRepository } from "../interfaces/repositories/ISubscriptionRepository";
import { Subscription } from "../domain/entities/subscription";
import { ISubscriptionInteractor } from "../interfaces/interactors/ISubscriptionInteractor";
import { editSubscriptionDto } from "../dtos/editSubscriptionDto";
import { conflictError } from "../domain/errors";
import { ISubscriptionDocument } from "../interfaces/documents/ISubscriptionDocument";


@injectable()
export class subscriptionInteractor implements ISubscriptionInteractor {
    constructor(@inject(INTERFACE_TYPE.subscriptionRepositoy) private subscriptionRepositoy: ISubscriptionRepository) { }

    async fetchSubscriptions(page: number, limit: number): Promise<{subscriptions: Subscription[] , total: number}> {
        const subscriptions =  await this.subscriptionRepositoy.findAll(page, limit)
        const total = await this.subscriptionRepositoy.totalDocumentCount()
        return { subscriptions, total }
    }

    async fetchSubscriptionById(id: string): Promise<ISubscriptionDocument> {
        return await this.subscriptionRepositoy.findById(id)
    }

    async addSubscription(data: Subscription) {

        //check a subscription exist with the same name
        const isExist = await this.subscriptionRepositoy.findSubscriptionByName(data.name)
        if (isExist) {
            throw new conflictError(`${data.name} already exist`)
        }
        
        const subscription = await this.subscriptionRepositoy.create(data)
        console.log('hello ',subscription)
        return subscription
    }

    async deleteSubscription(id: string) {
        await this.subscriptionRepositoy.deleteById(id)
    }

    async editSubscription(id: string, data: editSubscriptionDto): Promise<Subscription | null> {
        const { updatedData, features } = data
        console.log('updated data ', updatedData)

        //check a subscription exist with the same name
        if (updatedData && updatedData.name) {
            const isExist = await this.subscriptionRepositoy.findSubscriptionByName(updatedData.name)
            if (isExist) {
                console.log('here ', isExist)
                throw new conflictError(`${updatedData.name} already exist`)
            }
        }

        console.log('features ', features)
        //update basic details 
        if (updatedData) {
            await this.subscriptionRepositoy.updateSubscriptionData(id, updatedData)
        }

        if (features) {
            await this.subscriptionRepositoy.overrideFeatures(id, features)
        }

        return await this.subscriptionRepositoy.updateSubscriptionData(id, {})
    }
}