import { PickupRequest } from "../../domain/entities/picupRequest";
import { locationDto } from "../../dtos/locationDto";
import { pickupRequestStatusDto } from "../../dtos/pickupReqeustStatusDto";
import { IPickupeRequestDocument } from "../documents/IPickupRequestDocument";
import { IBaseRepository } from "./IBaseRepository";

export interface IPickupRequestRepository extends IBaseRepository<IPickupeRequestDocument>{

    checkRequestStatusById(id: string): Promise<{status: string}>

    createRequest(requestData: PickupRequest): Promise<string>

    findCollectorRequestsByTypeAndStatus(collectorId: string, type: string, status: string): Promise<IPickupeRequestDocument []>
    findUserRequestsByTypeAndStatus(userId: string, type: string, status: string): Promise<IPickupeRequestDocument []>

    findPendingRequestsWithLocation(location: locationDto, maxDistance: number): Promise<PickupRequest[]>
    // findRequestById(id: string): Promise<PickupRequest | null>

    findByUserIdAndStatusThenUpdate(userId: string, status: string, updatedData: Partial<PickupRequest>): Promise<void>

    findRequestByIdAndUpdate(reqeustId: string, updatedData: Partial<PickupRequest>): Promise<PickupRequest>

    findReqeustHistoryByUserIdAndStatus(userId: string, status: 'all' | pickupRequestStatusDto, page: number, limit: number): Promise<{requests: PickupRequest[] , total: number }>

    findReqeustHistoryByCollectorIdAndStatus(collectorId: string, status: 'all' | pickupRequestStatusDto, page: number, limit: number): Promise<{requests: PickupRequest[] , total: number }>

    findPaymentDetailsByUserId(userId: string): Promise<void>

    aggregateAreaDataWithCollectorId(collectorId: string): Promise<{city: string, total: number, pending: number, completed: number, cancelled: number} []>
}