import mongoose from "mongoose";
import { BaseRepository } from "../../infrastructure/database/repositories/baseRepository";
import { IScheduledPickupDocument } from "../documents/IScheduledPickupDocument";

export interface IScheduledPickupRepository extends BaseRepository<IScheduledPickupDocument> {
    findCollectorScheduledPickups(collectorId: string): Promise<any[]>;

    findByRequestId(pickupRequestId: string): Promise<IScheduledPickupDocument []>

    findOverduePickups(date: Date): Promise<IScheduledPickupDocument []>
    cancelOverduePickups(date: Date): Promise<mongoose.UpdateResult>
}