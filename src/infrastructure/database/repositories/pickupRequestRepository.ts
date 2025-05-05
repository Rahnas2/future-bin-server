import { injectable } from "inversify";
import pickupRequestModel from "../models/pickup_request";
import { IPickupRequestRepository } from "../../../interfaces/repositories/IPickupRequestRepository";
import { OnDemandPickupRequest, PickupRequest, SubscriptionPickupRequest } from "../../../domain/entities/picupRequest";
import { locationDto } from "../../../dtos/locationDto";
import { DatabaseError, notFound } from "../../../domain/errors";
import { BaseRepository } from "./baseRepository";
import { IPickupeRequestDocument } from "../../../interfaces/documents/IPickupRequestDocument";
import { pickupRequestStatusDto } from "../../../dtos/pickupReqeustStatusDto";
import { Types } from "mongoose";
import { summaryDto } from "../../../dtos/summaryDto";
import { requestTrendsDto } from "../../../dtos/requestTrendsDto";
import { districtPerformaceDto } from "../../../dtos/districtPerformaceDto";
import { topCitiesDto } from "../../../dtos/topAreaDto";

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



    async findByIdAndPopulateCollectorImageEmailMobile(id: string): Promise<PickupRequest> {
        try {
            const result: any = await this.model.findById(id)
                .populate('userId', 'image')
                .populate('collectorId', 'image email mobile')

            if (!result) {
                throw new notFound('request not found');
            }



            // Convert the Mongoose Document to a plain JS object
            const plain = result.toObject();

            const userId = plain.userId?._id?.toString();
            const collectorId = plain.collectorId?._id?.toString();
            
            const transformed = {
                ...plain,
                userId,  
                collectorId,
                userImage: plain.userId?.image ?? undefined,
                collectorImage: plain.collectorId?.image ?? undefined,
                collectorEmail: plain.collectorId?.email ?? undefined,
                collectorMobile: plain.collectorId?.mobile ?? undefined,
            };

            return transformed;

        } catch (error) {
            throw new DatabaseError(`error finding request by id  ${error}`)
        }
    }

    async createRequest(requestData: PickupRequest): Promise<string> {
        const result = await pickupRequestModel.insertOne(requestData);
        return result._id.toString()
    }

    async findCollectorRequestsByTypeAndStatus(collectorId: string, type: string, status: string): Promise<IPickupeRequestDocument[]> {
        try {
            const result = await this.model.find({ collectorId, type, status }).sort({ createdAt: -1 })
            return result

        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }

    async findUserRequestsByTypeAndStatus(userId: string, type: string, status: string): Promise<IPickupeRequestDocument[]> {
        try {
            const reuslt = await this.model.find({ userId, type, status }).sort({ createdAt: -1 })
            return reuslt
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }

    async findPendingRequestsWithLocation(location: locationDto, maxDistance: number): Promise<PickupRequest[]> {
        try {
            return await this.model.find({
                status: 'pending',
                'address.location': {
                    $near: {
                        $geometry: location,
                        $maxDistance: maxDistance
                    }
                }
            }).sort({ createdAt: -1 })
                .lean<PickupRequest[]>()
        } catch (error) {
            throw new DatabaseError(`data base error ${error}`)
        }

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

    async findReqeustHistoryByUserIdAndStatus(userId: string, status: 'all' | pickupRequestStatusDto, page: number, limit: number): Promise<{ requests: PickupRequest[], total: number }> {
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

    async findReqeustHistoryByCollectorIdAndStatus(collectorId: string, status: 'all' | pickupRequestStatusDto, page: number, limit: number): Promise<{ requests: PickupRequest[], total: number }> {
        try {

            const query: { collectorId: string, status?: pickupRequestStatusDto | { $ne: pickupRequestStatusDto } } = { collectorId }

            if (status !== 'all') {
                query.status = status;
            } else {
                query.status = { $ne: 'accepted' };
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

    async findPaymentDetailsByUserId(userId: string): Promise<void> {
        try {
        } catch (error) {
            throw new DatabaseError('database error')
        }
    }

    async aggregateAreaDataWithCollectorId(collectorId: string): Promise<{ city: string; total: number; pending: number; completed: number; cancelled: number; }[]> {
        try {
            const data = await this.model.aggregate([
                {
                    $match: { collectorId: new Types.ObjectId(collectorId) }
                },
                {
                    $group: {
                        _id: '$address.city',
                        total: { $sum: { $cond: [{ $ne: ['$status', 'accepted'] }, 1, 0] } },
                        pending: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
                        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                        cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
                    }
                },
                {
                    $project: {
                        _id: 0,
                        city: '$_id',
                        total: 1,
                        pending: 1,
                        completed: 1,
                        cancelled: 1
                    }
                }
            ])
            return data
        } catch (error) {
            throw new DatabaseError('database error')
        }
    }

    // PIckup Request Status Counts 
    async getStatusCounts(): Promise<{ status: string, count: number }[]> {
        try {
            const data = await this.model.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        status: '$_id',
                        count: 1
                    }
                }
            ])
            return data
        } catch (error) {
            throw new DatabaseError(`database error ${error}`)
        }
    }

    //Pickup Requst 
    async findrequestTrends(from: Date, to: Date): Promise<requestTrendsDto[]> {
        try {
            const result = await this.model.aggregate([
                {
                    $match: { createdAt: { $gte: from, $lte: to } }
                },
                {
                    $addFields: {
                        createdDate: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                        }
                    }
                },
                {
                    $group: {
                        _id: '$createdDate',
                        onDemand: {
                            $sum: {    
                                $cond: [{ $eq: ["$type", "on-demand"] }, 1, 0]
                            }
                        },
                        subscription: {
                            $sum: {
                                $cond: [{ $eq: ["$type", "subscription"] }, 1, 0]
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        date: '$_id',
                        onDemand: 1,
                        subscription: 1
                    }
                }
            ])
            console.log('result tends ', result)
            return result
        } catch (error) {
            throw new DatabaseError(`database error ${error}`)
        }
    }

    async findDistrictPerformace(from: Date, to: Date, limit: number): Promise<districtPerformaceDto[]> {
        try {
            return await this.model.aggregate([
                {
                    $match: { createdAt: { $gte: from, $lte: to } }
                },
                {
                    $group: {
                        _id: {
                            district: '$address.district',
                            city: '$address.city'
                        },

                        requestCount: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        '_id.district': 1,
                        requestCount: -1
                    }
                },
                {
                    $group: {
                        _id: '$_id.district',
                        districtRequestCount: { $sum: '$requestCount' },
                        topCity: { $first: "$_id.city" },
                        topCityCount: { $first: '$requestCount' }
                    }
                },
                {
                    $sort: {
                        districtRequestCount: -1
                    }
                },
                {
                    $limit: limit
                },
                {
                    $project: {
                        _id: 0,
                        district: '$_id',
                        districtRequestCount: 1,
                        topCity: 1,
                        topCityCount: 1
                    }
                }
            ])
        } catch (error) {
            throw new DatabaseError(`database error ${error}`)
        }
    }

    async findTopCitys(from: Date, to: Date, limit: number): Promise<topCitiesDto[]> {
        try {
            return await this.model.aggregate([
                {
                    $match: { createdAt: { $gte: from, $lte: to } }
                },
                {
                    $group: {
                        _id: '$address.city',
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { count: -1 }
                },
                {
                    $limit: limit
                },
                {
                    $project: {
                        _id: 0,
                        city: '$_id',
                        count: 1
                    }
                }
            ])
        } catch (error) {
            throw new DatabaseError(`database error ${error}`)
        }
    }

    async checkUserHasSubscription(userId: string): Promise<IPickupeRequestDocument | null> {
        try {
            return await this.model.findOne({ userId, type: 'subscription', status: { $in: ["pending", 'accepted', 'confirmed'] } })
        } catch (error) {
            throw new DatabaseError(`database error ${error}`)
        }
    }

}