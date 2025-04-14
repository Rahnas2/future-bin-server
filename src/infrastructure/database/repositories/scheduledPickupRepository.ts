import { injectable } from "inversify";
import { IScheduledPickupDocument } from "../../../interfaces/documents/IScheduledPickupDocument";
import { IScheduledPickupRepository } from "../../../interfaces/repositories/IScheduledRepository";
import { BaseRepository } from "./baseRepository";
import scheduledPickupModel from "../models/scheduledPickup";
import { Types } from "mongoose";

@injectable()
export class scheduledPickupRepository extends BaseRepository<IScheduledPickupDocument> implements IScheduledPickupRepository {
    constructor() {
        super(scheduledPickupModel)
    }


    async findCollectorScheduledPickups(collectorId: string): Promise<any[]> {
        const reuslt = this.model.aggregate([
            {
                $lookup: {
                    from: "pickup_requests",
                    localField: "pickupRequestId",
                    foreignField: "_id",
                    as: "pickupRequest",
                }
            },

            { $unwind: "$pickupRequest" },

            {
                $match: {
                    "pickupRequest.collectorId": new Types.ObjectId(collectorId),
                    "pickupRequest.status": { $in: ["confirmed"] },
                }
            },

            {
                $project: {
                  _id: 1,
                  scheduledDate: 1,
                  status: 1,
                  completedAt: 1,
                  pickupRequest: {
                    _id: "$pickupRequest._id",
                    name: "$pickupRequest.name",
                    mobile: "$pickupRequest.mobile",
                    email: "$pickupRequest.email",
                    totalPickups: "$pickupRequest.totalPickups",
                    completedPickups: "$pickupRequest.completedPickups",
                    status: "$pickupRequest.status",
                    subscriptionPlanId: "$pickupRequest.subscriptionPlanId",
                    subscriptionPlanName: "$pickupRequest.subscriptionPlanName",

                  }
                }
              }
        ])

        return reuslt
    }
}