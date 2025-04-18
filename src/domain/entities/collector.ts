
import { ObjectId } from "mongoose";

export interface ICollector {
    userId: string;
    idCard: {
        front: string;
        back: string;
    }
    vehicleDetails: {
        model: string;
        licencePlate: string;
        image: string
    }
    approvalStatus: string;
    status: string;
    stripeAccountId: string
}