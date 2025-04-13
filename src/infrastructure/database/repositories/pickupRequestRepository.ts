import { injectable } from "inversify";
import pickupRequestModel from "../models/pickup_request";
import { IPickupRequestRepository } from "../../../interfaces/repositories/IPickupRequestRepository";
import { OnDemandPickupRequest, PickupRequest, SubscriptionPickupRequest } from "../../../domain/entities/picupRequest";
import { locationDto } from "../../../dtos/locationDto";
import { DatabaseError, notFound } from "../../../domain/errors";
import { BaseRepository } from "./baseRepository";
import { IPickupeRequestDocument } from "../../../interfaces/documents/IPickupRequestDocument";
import { pickupRequestStatusDto } from "../../../dtos/pickupReqeustStatusDto";

@injectable()
export class pickupRequestRepository extends BaseRepository<IPickupeRequestDocument> implements IPickupRequestRepository {

    constructor() {
        super(pickupRequestModel)
    }

    async checkRequestStatusById(id: string): Promise<{ status: string; }> {
        try {
            const status = await this.model.findById(id, { _id: 0, status: 1 })

            if (!status) {
                throw new notFound('request not found')
            }

            return status
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }

    // async findRequestById(id: string): Promise<PickupRequest | null> {
    //     try {
    //         return await pickupRequestModel.findById(id)
    //     } catch (error) {
    //         throw new DatabaseError('data base error')
    //     }

    // }

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

            const updatedRequest = await pickupRequestModel.findByIdAndUpdate(reqeustId, { $set: updatedData }, { new: true })

            if (!updatedRequest) {
                throw new notFound('request not found')
            }

            return updatedRequest as unknown as PickupRequest;

        } catch (error) {
            throw new DatabaseError('database error')
        }
    }

    async findByUserIdAndStatusThenUpdate(userId: string, status: string, updatedData: Partial<PickupRequest>): Promise<void> {
        try {
            await pickupRequestModel.updateOne({ userId: userId, status: status }, { $set: updatedData }, { new: true })
        } catch (error) {
            throw new DatabaseError('database error')
        }
    }

    async findReqeustHistoryByUserIdAndStatus(userId: string, status: 'all' | pickupRequestStatusDto, page: number, limit: number): Promise<{requests: PickupRequest[] , total: number }> {
        try {
            const query: { userId: string, status?: pickupRequestStatusDto } = { userId }

            if (status !== 'all') {
                query.status = status;
            }

            const skip = (page - 1) * limit
            const [requests, total] = await Promise.all([
                this.model.find(query)
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 }),
                this.model.countDocuments(query)
            ])

            return { requests, total }
        } catch (error) {
            throw new DatabaseError('database error')
        }
    }

    async findReqeustHistoryByCollectorIdAndStatus(collectorId: string, status: 'all' | pickupRequestStatusDto, page: number, limit: number): Promise<{requests: PickupRequest[] , total: number }> {
        try {

            const query: { collectorId: string, status?: pickupRequestStatusDto } = { collectorId }

            if (status !== 'all') {
                query.status = status;
            }

            const skip = (page - 1) * limit

            const [requests, total] = await Promise.all([
                this.model.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }), 
                this.model.countDocuments(query)
            ])

            return { requests, total }
        } catch (error) {
            throw new DatabaseError('database error')
        }
    }


}