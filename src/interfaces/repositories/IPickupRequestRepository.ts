import { PickupRequest } from "../../domain/entities/picupRequest";
import { locationDto } from "../../dtos/locationDto";

export interface IPickupRequestRepository {
    createRequest(requestData: PickupRequest): Promise<string>
    findPendingRequestsWithLocation(location: locationDto, maxDistance: number): Promise<PickupRequest[] | []>
    findRequestById(id: string): Promise<PickupRequest | null>
}