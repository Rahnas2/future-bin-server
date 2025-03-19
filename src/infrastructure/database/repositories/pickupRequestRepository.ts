import { injectable } from "inversify";
import pickupRequestModel from "../models/pickup_request";
import { IPickupRequestRepository } from "../../../interfaces/repositories/IPickupRequestRepository";
import { OnDemandPickupRequest, PickupRequest, SubscriptionPickupRequest } from "../../../domain/entities/picupRequest";
import { locationDto } from "../../../dtos/locationDto";
import { DatabaseError, notFound } from "../../../domain/errors";

@injectable()
export class pickupRequestRepository implements IPickupRequestRepository {

    async checkRequestStatusById(id: string): Promise<{ status: string; }> {
        try {
            const status = await pickupRequestModel.findById(id, {_id: 0, status: 1})
            
            if(!status){
                throw new notFound('request not found')
            }

            return status
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }

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

    async findRequestByIdAndUpdate(reqeustId: string, updatedData: Partial<PickupRequest>): Promise<PickupRequest> {
        try {

            const updatedRequest = await pickupRequestModel.findByIdAndUpdate(reqeustId, {$set: updatedData}, {new: true})

            if(!updatedRequest){
                throw new notFound('request not found')
            }

            return updatedRequest as unknown as PickupRequest;

        } catch (error) {
            throw new DatabaseError('database error')
        }
    }

    async findReqeustHistoryByUserId(userId: string): Promise<PickupRequest[] | []> {
        try {
            return await pickupRequestModel.find({userId: userId})
        } catch (error) {
            throw new DatabaseError('database error')
        }
    }

    async findReqeustHistoryByCollectorId(collectorId: string): Promise<PickupRequest[] | []> {
        try {
            return await pickupRequestModel.find({collectorId: collectorId})
        } catch (error) {
           throw new DatabaseError('database error')   
        }
    }


}