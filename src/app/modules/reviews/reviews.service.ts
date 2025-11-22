import type { IReview } from "./reviews.interface.js"
import { ReviewModel } from "./reviews.model.js"

export const ReviewServices = {
    addReview: async (payload: IReview) => {
        return ReviewModel.create(payload)
    },

    getReviewsByProductId: async (productId: string) => {
        return ReviewModel.find({ productId })
    },

    deleteReview: async (reviewId: string) => {
        return ReviewModel.findByIdAndDelete(reviewId)
    },

    updateReview: async (reviewId: string, payload: Partial<IReview>) => {
        return ReviewModel.findByIdAndUpdate(
            reviewId,
            { $set: payload },
            { new: true }
        )
    }
}