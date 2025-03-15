import { injectable } from "inversify";
import { Subscription } from "../../../domain/entities/subscription";
import subscriptionModel from "../models/subscription";
import { ISubscriptionRepository } from "../../../interfaces/repositories/ISubscriptionRepository";
import { editSubscriptionDto } from "../../../dtos/editSubscriptionDto";
import { notFound } from "../../../domain/errors";

@injectable()
export class subscriptionRepositoy implements ISubscriptionRepository {

    async findAllSubscriptions(): Promise<Subscription[] | null> {
        return await subscriptionModel.find({})
    }

    //find subscriptin by id
    async findSubscriptionById(id: string): Promise<Subscription | null> {
        return await subscriptionModel.findById(id)
    }

    //find subscriptin by name
    async findSubscriptionByName(name: string): Promise<Subscription | null> {
        return await subscriptionModel.findOne({ name: { $regex: new RegExp(name, 'i') } })
    }

    //add new subscription 
    async addSubscription(data: Subscription): Promise<Subscription> {
        return await subscriptionModel.create(data)
    }

    //delete subsction by name
    async deleteSubscriptionById(id: string): Promise<void> {
        await subscriptionModel.findByIdAndDelete(id)
    }

    //update subsction 
    async updateSubscriptionData(id: string, updatedData: Partial<editSubscriptionDto["updatedData"]>): Promise<Subscription | null> {
        return await subscriptionModel.findByIdAndUpdate(id,
            {
                $set: updatedData
            },
            { new: true }
        )
    }

    async addNewFeatures(id: string, newFeatures: string[]): Promise<Subscription | null> {
        return await subscriptionModel.findByIdAndUpdate(id,
            {
                $push: { features: { $each: newFeatures } }
            },
            { new: true }
        )
    }

    //add new features
    async editFeatures(id: string, editedFeatures: { index: number; value: string; }[]): Promise<Subscription | null> {
        try {
            const subscription = await subscriptionModel.findById(id)

            if (!subscription) {
                throw new notFound('subscriptin not found')
            }

            editedFeatures.forEach(edit => {
                if (subscription.features[edit.index] !== undefined) {
                    subscription.features[edit.index] = edit.value
                }
            })

            await subscription.save()

            return subscription
        } catch (error) {
            console.log('edit feature error  ', error)
            return null
        }

    }

    //override features
    async overrideFeatures(id: string, features: string[]): Promise<Subscription | null> {
        return subscriptionModel.findByIdAndUpdate(id, {
            $set: { features: features}
        }, {new: true})
    }

    async removeFeature(id: string, removedFeatures: number[]): Promise<Subscription | null> {
        const subscription = await subscriptionModel.findById(id)

        if (!subscription) {
            throw new notFound('subscriptin not found')
        }

        subscription.features = subscription.features.filter((_, index) => !removedFeatures.includes(index))

        return subscription.save()
    }
}