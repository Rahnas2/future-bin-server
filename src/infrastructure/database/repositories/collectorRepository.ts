
import { injectable } from "inversify";
import collectorModel from "../models/collector";
import { ICollector } from "../../../domain/entities/collector";
import { ICollectorRepository } from "../../../interfaces/repositories/ICollectorRepository";
import userModel from "../models/user";
import { collectorFullDetailsDto } from "../../../dtos/collectorFullDetailsDto";
import { FilterQuery, Types } from "mongoose";
import { BaseRepository } from "./baseRepository";
import { ICollectorDocument } from "../../../interfaces/documents/ICollectorDocument";
import { DatabaseError } from "../../../domain/errors";

@injectable()
export class collectorRepoitory extends BaseRepository<ICollectorDocument> implements ICollectorRepository {


    constructor() {
        super(collectorModel)
    }

    //find all collectors with  registeration request approval status
    async findAllCollectorsWithStatus(approvedStatus: string, page: number, limit: number, search: string): Promise<{ collectors: Partial<collectorFullDetailsDto>[], total: number }> {
        try {
            const query: FilterQuery<ICollector> = {
                role: 'collector'
            }
            if (search.trim()) {
                const regex = new RegExp(search, 'i');
                query.$or = [
                    { firstName: regex },
                    { lastName: regex },
                    { email: regex },
                    { mobile: regex },
                    { 'address.city': regex },
                    { 'address.district': regex },
                    { approvalStatus: regex },
                    {
                        $expr: {
                            $regexMatch: {
                                input: { $concat: ['$firstName', ' ', '$lastName'] },
                                regex: search,
                                options: 'i'
                            }
                        }
                    }
                ];
            }

            const skip = (page - 1) * limit
            const result = await userModel.aggregate([
                {
                    $match: query
                },
                {
                    $lookup: {
                        from: "collectors",
                        localField: "_id",
                        foreignField: "userId",
                        as: "details"
                    }
                },
                {
                    $unwind: '$details'
                },
                {
                    $match: {
                        'details.approvalStatus': approvedStatus
                    }
                },
                {
                    $project: {
                        firstName: 1,
                        lastName: 1,
                        email: 1,
                        mobile: 1,
                        password: 1,
                        image: 1,
                        "address.district": 1,
                        "address.city": 1,
                        "details.status": 1
                    }
                },
                {
                    $facet: {
                        data: [
                            { $skip: skip },
                            { $limit: limit },
                        ],
                        total: [{ $count: 'total' }]
                    }
                }
            ])
            return { collectors: result[0].data, total: result[0].total[0]?.total || 0 };
        } catch (error) {
            throw new DatabaseError('data base error')
        }
    }




    //find collectors
    async findCollectorDetails(userId: string): Promise<collectorFullDetailsDto | null> {
        const result = await userModel.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "collectors",
                    localField: "_id",
                    foreignField: "userId",
                    as: "details"
                }
            },
            {
                $unwind: '$details'
            }
        ])
        console.log('result ', result)
        return result.length ? result[0] : null
    }

    //find collector by id
    async findCollectorById(collectorId: string): Promise<ICollector | null> {
        return await collectorModel.findById(collectorId)
    }

    //update collector registeration request status
    async updateCollectorRequestStatus(collectorId: string, status: string): Promise<void> {
        await collectorModel.findByIdAndUpdate(collectorId, { approvalStatus: status }, { new: true })
    }

    //find active collectors from an array of userId
    async findActiveCollectorsByUserId(ids: string[]): Promise<{ userId: string }[] | null> {
        return await collectorModel.find({ userId: { $in: ids }, status: 'active' }, { _id: 0, userId: 1 })
    }

}