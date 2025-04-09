import  { Schema, model, Types } from "mongoose";
import { IReviewDocument } from "../../../interfaces/documents/IReviewDocument";

const reviewSchema = new Schema ({
    userId: {
        type: Types.ObjectId,
        ref: 'user',
        required: true
      },
      type: {
        type: String,
        enum: ['collector', 'app'],
        required: true
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        maxlength: 500
      },
      collectorId: {
        type: Types.ObjectId,
        ref: 'Collector',
        required: function(this: IReviewDocument) {
          return this.type === 'collector';
        }
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
})

const reviewModel = model<IReviewDocument>('review', reviewSchema)

export default reviewModel