import { ReviewServices } from "./reviews.service.js";
import { apiSuccess, apiError } from "../../utlis/apiResponse.js";

const ReviewController = {
    // create review
    addReview: async (req, res) => {
        try {
            const result = await ReviewServices.addReview(req);

            return apiSuccess(
                res,
                result,
                "Review added successfully"
            );
        } catch (error) {
            if (error.code === 11000) {
                return apiError(
                    res,
                    error,
                    "You already reviewed this product"
                );
            }

            return apiError(
                res,
                error,
                "Failed to add review"
            );
        }
    },

    // update review
    updateReview: async (req, res) => {
        try {
            const { reviewId } = req.params;

            const result = await ReviewServices.updateReview(
                reviewId,
                req
            );

            return apiSuccess(res, result, "Review updated");
        } catch (error) {
            return apiError(
                res,
                error,
                "Failed to update review"
            );
        }
    },

    // delete review
    deleteReview: async (req, res) => {
        try {
            const { reviewId } = req.params;
            const { userId } = req.body; // ✅ auth নাই, body থেকে

            const result = await ReviewServices.deleteReview(
                reviewId,
                userId
            );

            return apiSuccess(res, result, "Review deleted");
        } catch (error) {
            return apiError(
                res,
                error,
                "Failed to delete review"
            );
        }
    },

    // get reviews by product
    getReviewsByProduct: async (req, res) => {
        try {
            const { productId } = req.params;

            if (!productId) {
                return apiError(
                    res,
                    null,
                    "productId is required",
                );
            }

            const result =
                await ReviewServices.getReviewsByProduct(productId);

            return apiSuccess(
                res,
                result,
                "Product reviews fetched successfully"
            );
        } catch (error) {
            return apiError(
                res,
                error,
                "Failed to fetch product reviews"
            );
        }
    },
};

export default ReviewController;
