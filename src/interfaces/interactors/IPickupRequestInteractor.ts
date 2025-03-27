import { PickupRequest } from "../../domain/entities/picupRequest";
import { locationDto } from "../../dtos/locationDto";

import { IBaseRepository } from "../repositories/IBaseRepository";

export interface IPickupRequestInteractor {
    createPickupRequest(requestData: PickupRequest): Promise<void>

    getPickupRequestByCollectorId(id: string): Promise<PickupRequest[] | []>

    getPickupRequestById(id: string): Promise<PickupRequest>

    acceptRequest(collectorId: string, requestId: string, collectorName: string): Promise<void>

    userPickupRequestHistory(id: string, role: string): Promise<PickupRequest[] | []>

    updatePaymentStatus(id: string, paymentStatus: string): Promise<void>

}