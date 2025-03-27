import { Document } from "mongoose";
import { WasteType } from "../../domain/entities/wasteType";

export interface IWasteTypeDocument extends WasteType, Document {
    _id: string
}