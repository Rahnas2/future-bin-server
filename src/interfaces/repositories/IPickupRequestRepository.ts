import { PickupRequest } from "../../domain/entities/picupRequest";
import { locationDto } from "../../dtos/locationDto";

export interface IPickupRequestRepository {

    checkRequestStatusById(id: string): Promise<{status: string}>

    createRequest(requestData: PickupRequest): Promise<string>
    findPendingRequestsWithLocation(location: locationDto, maxDistance: number): Promise<PickupRequest[] | []>
    findRequestById(id: string): Promise<PickupRequest | null>

    findRequestByIdAndUpdate(reqeustId: string, updatedData: Partial<PickupRequest>): Promise<PickupRequest>

    findReqeustHistoryByUserId(userId: string): Promise<PickupRequest[] | []>

    findReqeustHistoryByCollectorId(collectorId: string): Promise<PickupRequest[] | []>


}