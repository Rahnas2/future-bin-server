import { injectable } from "inversify";
import pickupRequestModel from "../models/pickup_request";
import { IPickupRequestRepository } from "../../../interfaces/repositories/IPickupRequestRepository";
import { OnDemandPickupRequest, PickupRequest, SubscriptionPickupRequest } from "../../../domain/entities/picupRequest";
import { locationDto } from "../../../dtos/locationDto";
import { DatabaseError } from "../../../domain/errors";

@injectable()
export class pickupRequestRepository implements IPickupRequestRepository {

    async findRequestById(id: string): Promise<PickupRequest | null> {
        try {
            return await pickupRequestModel.findById(id)
        } catch (error) {
            throw new DatabaseError('data base error')
        }

    }

    async createRequest(requestData: PickupRequest): Promise<string> {
        const result = await pickupRequestModel.insertOne(requestData);
        return result._id.toString()
    }


    async findPendingRequestsWithLocation(location: locationDto, maxDistance: number): Promise<PickupRequest[] | []> {
        return await pickupRequestModel.find({
            status: 'pending',
            'address.location': {
                $near: {
                    $geometry: location,
                    $maxDistance: maxDistance
                }
            }
        }).sort({ createdAt: -1 })
            .lean<PickupRequest[]>()
    }


}