import { model, Schema, Types } from "mongoose";
import type { IReview } from "./reviews.interface.js";


const ReviewSchema = new Schema<IReview>({
    productId: { type: String, required: true, },
    reviewerId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
}, {
    timestamps: true
})

export const ReviewModel = model<IReview>("reviews", ReviewSchema);