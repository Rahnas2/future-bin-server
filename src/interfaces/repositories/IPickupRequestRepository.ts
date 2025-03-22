import { PickupRequest } from "../../domain/entities/picupRequest";
import { locationDto } from "../../dtos/locationDto";
import { IPickupeRequestDocument } from "../documents/IPickupRequestDocument";
import { IBaseRepository } from "./IBaseRepository";

export interface IPickupRequestRepository extends IBaseRepository<IPickupeRequestDocument>{

    checkRequestStatusById(id: string): Promise<{status: string}>

    createRequest(requestData: PickupRequest): Promise<string>
    findPendingRequestsWithLocation(location: locationDto, maxDistance: number): Promise<PickupRequest[] | []>
    findRequestById(id: string): Promise<PickupRequest | null>

    findByUserIdAndStatusThenUpdate(userId: string, status: string, updatedData: Partial<PickupRequest>): Promise<void>

    findRequestByIdAndUpdate(reqeustId: string, updatedData: Partial<PickupRequest>): Promise<PickupRequest>

    findReqeustHistoryByUserId(userId: string): Promise<PickupRequest[] | []>

    findReqeustHistoryByCollectorId(collectorId: string): Promise<PickupRequest[] | []>


}