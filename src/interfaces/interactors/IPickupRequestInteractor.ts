import { PickupRequest } from "../../domain/entities/picupRequest";
import { locationDto } from "../../dtos/locationDto";

export interface IPickupRequestInteractor {
    createPickupRequest(requestData: PickupRequest): Promise<void>
    getNearPickupRequestById(id: string): Promise<PickupRequest[] | []>
    getPickupRequestById(id: string): Promise<PickupRequest>
}