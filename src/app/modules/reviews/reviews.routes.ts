import { Router } from "express";
import { ReviewsController } from "./reviews.controller.js";


const router = Router()

// add a review
router.post('/add-review', ReviewsController.addReview)

// get all of the review according to the productId
router.get('/:productId', ReviewsController.getReviewByProductID)

// delete a review by reviewID
router.delete('/:reviewId', ReviewsController.deleteReview)

// update a review by reviwID
router.patch('/:reviewId', ReviewsController.updateReview)

export const ReviewRouter = router