import { Document, Types } from "mongoose";
import { Review } from "../../domain/entities/review";

export interface IReviewDocument extends Review, Document {
    _id: Types.ObjectId
}