import { model, Schema } from "mongoose";

const ReviewSchema = new Schema({
    productId: { type: String, required: true },
    reviewerId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
}, {
    timestamps: true
});

export const ReviewModel = model("reviews", ReviewSchema);
