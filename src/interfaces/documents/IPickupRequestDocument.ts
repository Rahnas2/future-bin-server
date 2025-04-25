import { Document } from "mongoose";

import { PickupRequest } from "../../domain/entities/picupRequest";

export type IPickupeRequestDocument = PickupRequest & Document & {
    _id: string
};