import { BaseRepository } from "../../infrastructure/database/repositories/baseRepository";
import { IScheduledPickupDocument } from "../documents/IScheduledPickupDocument";

export interface IScheduledPickupRepository extends BaseRepository<IScheduledPickupDocument> {}