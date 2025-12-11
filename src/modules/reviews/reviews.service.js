import { ReviewModel } from "./reviews.model.js";

export const ReviewServices = {
    addReview: async (payload) => {
        return ReviewModel.create(payload);
    },

    getReviewsByProductId: async (productId) => {
        return ReviewModel.find({ productId });
    },

    deleteReview: async (reviewId) => {
        return ReviewModel.findByIdAndDelete(reviewId);
    },

    updateReview: async (reviewId, payload) => {
        return ReviewModel.findByIdAndUpdate(
            reviewId,
            { $set: payload },
            { new: true }
        );
    }
};
