import { PickupRequest } from "../../domain/entities/picupRequest";
import { locationDto } from "../../dtos/locationDto";
import { requestCancellationDto } from "../../dtos/requestCancellationDto";
import { IPickupeRequestDocument } from "../documents/IPickupRequestDocument";

import { IBaseRepository } from "../repositories/IBaseRepository";

export interface IPickupRequestInteractor {
    createPickupRequest(requestData: PickupRequest): Promise<void>

    getPickupRequestByCollectorId(id: string): Promise<PickupRequest[] | []>

    getPickupRequestById(id: string): Promise<PickupRequest>

    getPickupRequestsByTypeAndStatus(type: string, status: string, role: string, userId: string): Promise<PickupRequest []>

    getAreaDataForCollector(collectorId: string): Promise<{city: string, total: number, pending: number, completed: number, cancelled: number} []>

    acceptRequest(collectorId: string, requestId: string, collectorName: string): Promise<void>

    updatePickupRequest(id: string, data: Partial<PickupRequest>): Promise<IPickupeRequestDocument>

    userPickupRequestHistoryByStatus(id: string, role: string, status: string, page: number, limit: number): Promise<{requests: PickupRequest[] , total: number }>

    updatePaymentStatus(id: string, paymentStatus: string): Promise<void>

    cancelRequest(id: string, role: 'resident' | 'collector', data: Partial<requestCancellationDto>): Promise<IPickupeRequestDocument>

    completeRequest(id: string): Promise<IPickupeRequestDocument>

}