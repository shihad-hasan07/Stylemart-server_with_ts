import { ProductsModel } from "../products/products.model.js";
import { Review } from "./reviews.model.js";

/**
 * Add review
 */
const addReview = async (req) => {
    const { productId, rating, comment, userId } = req.body;

    if (!userId) {
        throw new Error("userId is required");
    }

    const product = await ProductsModel.findById(productId);
    if (!product) {
        throw new Error("Product not found");
    }

    const review = await Review.create({
        productId,
        userId,
        rating,
        comment,
    });

    // update product rating
    const oldCount = product.rating.count;
    const oldAverage = product.rating.average;

    const newCount = oldCount + 1;
    const newAverage =
        (oldAverage * oldCount + rating) / newCount;

    product.rating.count = newCount;
    product.rating.average = Number(newAverage.toFixed(1));

    await product.save();

    return review;
};

/**
 * Update review
 */
const updateReview = async (reviewId, req) => {
    const { rating, comment, userId } = req.body;

    if (!userId) {
        throw new Error("userId is required");
    }

    const review = await Review.findOne({
        _id: reviewId,
        userId,
    });

    if (!review) {
        throw new Error("Review not found or unauthorized");
    }

    const product = await ProductsModel.findById(review.productId);
    if (!product) {
        throw new Error("Product not found");
    }

    const count = product.rating.count;
    const oldAverage = product.rating.average;

    const newAverage =
        (oldAverage * count - review.rating + rating) / count;

    product.rating.average = Number(newAverage.toFixed(1));
    await product.save();

    review.rating = rating;
    if (comment !== undefined) {
        review.comment = comment;
    }

    await review.save();

    return review;
};

/**
 * Delete review
 */
const deleteReview = async (reviewId, userId) => {
    if (!userId) {
        throw new Error("userId is required");
    }

    const review = await Review.findOne({
        _id: reviewId,
        userId,
    });

    if (!review) {
        throw new Error("Review not found or unauthorized");
    }

    const product = await ProductsModel.findById(review.productId);
    if (!product) {
        throw new Error("Product not found");
    }

    const count = product.rating.count;
    const oldAverage = product.rating.average;

    const newCount = count - 1;

    const newAverage =
        newCount === 0
            ? 0
            : (oldAverage * count - review.rating) / newCount;

    product.rating.count = newCount;
    product.rating.average = Number(newAverage.toFixed(1));

    await product.save();
    await review.deleteOne();

    return true;
};

/**
 * Get reviews by product
 */
const getReviewsByProduct = async (productId) => {
    const reviews = await Review.find({ productId })
        .populate({
            path: "userId",
            select: "name photoURL -_id",
        })
        .sort({ createdAt: -1 });

    return {
        productId,
        reviews: reviews.map(r => ({
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt,
            user: r.userId,
        })),
    };
};


export const ReviewServices = {
    addReview,
    updateReview,
    deleteReview,
    getReviewsByProduct,
};
