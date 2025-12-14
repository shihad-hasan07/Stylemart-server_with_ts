import { Router } from "express";
import ReviewController from "./reviews.controller.js";


const router = Router();

/**
 * Create review
 * POST /api/reviews
 */
router.post("/", ReviewController.addReview);

/**
 * Update review
 * PATCH /api/reviews/:reviewId
 */
router.patch("/:reviewId", ReviewController.updateReview);

/**
 * Delete review
 * DELETE /api/reviews/:reviewId
 */
router.delete("/:reviewId", ReviewController.deleteReview);

/**
 * Get reviews by product
 * GET /api/reviews/:productId
 */
router.get("/:productId", ReviewController.getReviewsByProduct);

export default router;
