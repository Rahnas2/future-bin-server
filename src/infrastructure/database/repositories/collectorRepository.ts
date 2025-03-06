
import { injectable } from "inversify";
import collectorModel from "../models/collector";
import { ICollector } from "../../../domain/entities/collector";
import { ICollectorRepository } from "../../../interfaces/repositories/ICollectorRepository";
import userModel from "../models/user";
import { collectorFullDetailsDto } from "../../../dtos/collectorFullDetailsDto";
import { Types } from "mongoose";

@injectable()
export class collectorRepoitory implements ICollectorRepository {

    async findAllCollectorsWithStatus(approvedStatus: string): Promise<Partial<collectorFullDetailsDto>[] | []> {
        return await userModel.aggregate([
            {
                $match: {
                    role: 'collector'
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
                    "address.city":1,
                    "details.status": 1
                }
            }
        ])
    }

    async findCollectorDetails(userId: string): Promise<collectorFullDetailsDto | null> {
        const result =  await userModel.aggregate([
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

    async findCollectorById(collectorId: string): Promise<ICollector | null> {
        return await collectorModel.findById(collectorId)
    }

    async updateCollectorRequestStatus(collectorId: string, status: string): Promise<void> {
        await collectorModel.findByIdAndUpdate(collectorId, { approvalStatus: status }, { new: true })
    }

}