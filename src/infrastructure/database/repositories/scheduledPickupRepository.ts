import { injectable } from "inversify";
import { IScheduledPickupDocument } from "../../../interfaces/documents/IScheduledPickupDocument";
import { IScheduledPickupRepository } from "../../../interfaces/repositories/IScheduledRepository";
import { BaseRepository } from "./baseRepository";

@injectable()
export class scheduledPickupRepository extends BaseRepository<IScheduledPickupDocument> implements IScheduledPickupRepository {

}