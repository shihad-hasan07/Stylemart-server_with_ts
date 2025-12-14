import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "products",
            required: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            trim: true,
            maxlength: 500,
        },
    },
    {
        timestamps: true,
    }
);


// One user can review one product only once

reviewSchema.index(
    { productId: 1, userId: 1 },
    { unique: true }
);

export const Review = model("Review", reviewSchema);
