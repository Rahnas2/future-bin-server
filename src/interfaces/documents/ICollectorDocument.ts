import { Document, Types } from "mongoose";
import { ICollector } from "../../domain/entities/collector";


export interface ICollectorDocument extends ICollector, Document {
    _id: string
} 