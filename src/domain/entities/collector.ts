
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
    wallet: {
        balance: number;
        transactions: {
            amount: number,
            type: string,
            discription?: string,
            date: Date
        }
    };
    // createdAt: Date;
    // updatedAt: Date;
}