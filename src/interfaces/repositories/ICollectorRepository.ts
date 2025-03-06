import { ICollector } from "../../domain/entities/collector";
import { collectorFullDetailsDto } from "../../dtos/collectorFullDetailsDto";

export interface ICollectorRepository {
    findAllCollectorsWithStatus(status: string): Promise<Partial<collectorFullDetailsDto>[] | []>
    findCollectorDetails(userId: string): Promise<collectorFullDetailsDto | null>
    findCollectorById(collectorId: string) : Promise<ICollector | null>
    updateCollectorRequestStatus(collectorID: string, status: string): Promise<void>
}