import { ICollector } from "../../domain/entities/collector";
import { collectorFullDetailsDto } from "../../dtos/collectorFullDetailsDto";
import { ICollectorDocument } from "../documents/ICollectorDocument";
import { IBaseRepository } from "./IBaseRepository";

export interface ICollectorRepository extends IBaseRepository<ICollectorDocument>{
    findAllCollectorsWithStatus(status: string, page: number, limit: number, search: string): Promise<{collectors: Partial<collectorFullDetailsDto>[] , total: number}>

    findCollectorDetails(userId: string): Promise<collectorFullDetailsDto | null>
    findCollectorById(collectorId: string) : Promise<ICollector | null>
    updateCollectorRequestStatus(collectorID: string, status: string): Promise<void>
    findActiveCollectorsByUserId(ids: string[]): Promise<{userId: string} [] | null> 
}